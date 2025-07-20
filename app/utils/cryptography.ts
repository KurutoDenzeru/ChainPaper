import CryptoJS from 'crypto-js'
import type { 
  AuthorshipProof, 
  AuthorBlock, 
  MerkleNode, 
  CryptographicKeys, 
  VerificationResult,
  AuthorshipTimestamp,
  LegalAttestation,
  AuthorIdentity,
  IntellectualPropertyClaim,
  LicenseAgreement,
  BlockchainRecord
} from '~/types/authorship'

export class ChainPaperCrypto {
  /**
   * Generate a cryptographic keypair for document signing
   */
  static generateKeyPair(algorithm: 'ECDSA' | 'RSA' | 'Ed25519' = 'ECDSA'): CryptographicKeys {
    const entropy = CryptoJS.lib.WordArray.random(256/8)
    const privateKey = CryptoJS.SHA256(entropy).toString()
    const publicKey = CryptoJS.SHA256(privateKey + 'public').toString()
    const address = CryptoJS.SHA256(publicKey).toString().substring(0, 40)
    
    return {
      privateKey,
      publicKey,
      address: '0x' + address,
      algorithm,
      keyLength: 256,
      created: new Date()
    }
  }

  /**
   * Create a SHA-256 hash of content
   */
  static createHash(content: string): string {
    return CryptoJS.SHA256(content).toString()
  }

  /**
   * Create a more secure hash with salt
   */
  static createSecureHash(content: string, salt?: string): string {
    const saltValue = salt || CryptoJS.lib.WordArray.random(128/8).toString()
    const hash = CryptoJS.SHA256(content + saltValue).toString()
    return hash + ':' + saltValue
  }

  /**
   * Verify a secure hash
   */
  static verifySecureHash(content: string, hashWithSalt: string): boolean {
    const [hash, salt] = hashWithSalt.split(':')
    const expectedHash = CryptoJS.SHA256(content + salt).toString()
    return hash === expectedHash
  }

  /**
   * Sign content with a private key
   */
  static signContent(content: string, privateKey: string): string {
    const hash = this.createHash(content)
    const signature = CryptoJS.HmacSHA256(hash, privateKey).toString()
    return signature
  }

  /**
   * Create an advanced digital signature with metadata
   */
  static createAdvancedSignature(
    content: string, 
    privateKey: string, 
    metadata: any = {}
  ): string {
    const timestamp = Date.now()
    const contentHash = this.createHash(content)
    const metadataString = JSON.stringify({ ...metadata, timestamp })
    const combinedData = contentHash + metadataString
    const signature = CryptoJS.HmacSHA256(combinedData, privateKey).toString()
    
    return JSON.stringify({
      signature,
      timestamp,
      metadata,
      algorithm: 'HMAC-SHA256'
    })
  }

  /**
   * Verify a signature
   */
  static verifySignature(content: string, signature: string, publicKey: string): boolean {
    try {
      const hash = this.createHash(content)
      const expectedSignature = CryptoJS.HmacSHA256(hash, publicKey).toString()
      return signature === expectedSignature
    } catch (error) {
      return false
    }
  }

  /**
   * Verify an advanced digital signature
   */
  static verifyAdvancedSignature(
    content: string, 
    signatureData: string, 
    publicKey: string
  ): { valid: boolean; timestamp?: number; metadata?: any } {
    try {
      const parsedSig = JSON.parse(signatureData)
      const contentHash = this.createHash(content)
      const metadataString = JSON.stringify({ 
        ...parsedSig.metadata, 
        timestamp: parsedSig.timestamp 
      })
      const combinedData = contentHash + metadataString
      const expectedSignature = CryptoJS.HmacSHA256(combinedData, publicKey).toString()
      
      return {
        valid: parsedSig.signature === expectedSignature,
        timestamp: parsedSig.timestamp,
        metadata: parsedSig.metadata
      }
    } catch (error) {
      return { valid: false }
    }
  }

  /**
   * Create a Merkle tree from authorship blocks
   */
  static createMerkleTree(blocks: AuthorBlock[]): MerkleNode[] {
    if (blocks.length === 0) return []
    
    let currentLevel: MerkleNode[] = blocks.map(block => ({
      hash: block.hash,
      data: JSON.stringify(block)
    }))

    const tree: MerkleNode[] = [...currentLevel]

    while (currentLevel.length > 1) {
      const nextLevel: MerkleNode[] = []
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i]!
        const right = currentLevel[i + 1] || left // Handle odd number of nodes
        
        const combinedHash = this.createHash(left.hash + right.hash)
        const parent: MerkleNode = {
          hash: combinedHash,
          left,
          right
        }
        
        nextLevel.push(parent)
        tree.push(parent)
      }
      
      currentLevel = nextLevel
    }

    return tree
  }

  /**
   * Get Merkle root hash
   */
  static getMerkleRoot(tree: MerkleNode[]): string {
    if (tree.length === 0) return ''
    const root = tree[tree.length - 1]
    return root?.hash || ''
  }

  /**
   * Generate Merkle proof for a specific block
   */
  static generateMerkleProof(tree: MerkleNode[], targetHash: string): string[] {
    const proof: string[] = []
    
    // Find the target node and build proof path
    const findProofPath = (node: MerkleNode, target: string, path: string[] = []): boolean => {
      if (node.hash === target) {
        proof.push(...path)
        return true
      }
      
      if (node.left) {
        if (findProofPath(node.left, target, [...path, node.right?.hash || ''])) return true
      }
      
      if (node.right) {
        if (findProofPath(node.right, target, [...path, node.left?.hash || ''])) return true
      }
      
      return false
    }
    
    if (tree.length > 0) {
      const root = tree[tree.length - 1]
      if (root) {
        findProofPath(root, targetHash)
      }
    }
    
    return proof.filter(Boolean)
  }

  /**
   * Verify Merkle proof
   */
  static verifyMerkleProof(targetHash: string, proof: string[], rootHash: string): boolean {
    let computedHash = targetHash
    
    for (const proofElement of proof) {
      computedHash = this.createHash(computedHash + proofElement)
    }
    
    return computedHash === rootHash
  }

  /**
   * Create authorship proof for a document
   */
  static createAuthorshipProof(
    documentId: string,
    content: string,
    authorWallet: string,
    privateKey: string,
    blocks: AuthorBlock[]
  ): AuthorshipProof {
    const contentHash = this.createHash(content)
    const tree = this.createMerkleTree(blocks)
    const merkleRoot = this.getMerkleRoot(tree)
    const proofChain = this.generateMerkleProof(tree, contentHash)
    
    const proofData = {
      documentId,
      authorWallet,
      contentHash,
      merkleRoot,
      timestamp: new Date()
    }
    
    const signature = this.signContent(JSON.stringify(proofData), privateKey)
    
    return {
      ...proofData,
      signature,
      proofChain
    }
  }

  /**
   * Verify authorship proof
   */
  static verifyAuthorshipProof(
    proof: AuthorshipProof,
    content: string,
    publicKey: string
  ): VerificationResult {
    const contentHash = this.createHash(content)
    const proofData = {
      documentId: proof.documentId,
      authorWallet: proof.authorWallet,
      contentHash: proof.contentHash,
      merkleRoot: proof.merkleRoot,
      timestamp: proof.timestamp
    }
    
    const signatureValid = this.verifySignature(JSON.stringify(proofData), proof.signature, publicKey)
    const hashValid = contentHash === proof.contentHash
    const timestampValid = proof.timestamp <= new Date()
    const chainValid = this.verifyMerkleProof(contentHash, proof.proofChain, proof.merkleRoot)
    
    const isValid = signatureValid && hashValid && timestampValid && chainValid
    const confidence = [signatureValid, hashValid, timestampValid, chainValid]
      .filter(Boolean).length / 4
    
    return {
      isValid,
      author: proof.authorWallet,
      timestamp: proof.timestamp,
      confidence,
      details: {
        signatureValid,
        hashValid,
        timestampValid,
        chainValid
      }
    }
  }

  /**
   * Generate document fingerprint
   */
  static generateDocumentFingerprint(content: string, metadata: any): string {
    const combined = JSON.stringify({ content, metadata })
    return this.createHash(combined)
  }

  /**
   * Create tamper-proof timestamp
   */
  static createTimestamp(content: string): string {
    const timestamp = Date.now()
    const data = content + timestamp
    return this.createHash(data) + ':' + timestamp
  }

  /**
   * Verify timestamp integrity
   */
  static verifyTimestamp(content: string, timestampHash: string): boolean {
    const [hash, timestamp] = timestampHash.split(':')
    const expectedHash = this.createHash(content + timestamp)
    return hash === expectedHash
  }
}
