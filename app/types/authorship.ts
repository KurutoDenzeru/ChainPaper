export interface AuthorshipProof {
  documentId: string
  authorWallet: string
  signature: string
  timestamp: Date
  contentHash: string
  merkleRoot: string
  proofChain: string[]
}

export interface AuthorBlock {
  id: string
  author: string
  authorWallet: string
  content: string
  hash: string
  signature: string
  timestamp: Date
  position: {
    from: number
    to: number
  }
  parentHash?: string
}

export interface VerificationResult {
  isValid: boolean
  author: string
  timestamp: Date
  confidence: number
  details: {
    signatureValid: boolean
    hashValid: boolean
    timestampValid: boolean
    chainValid: boolean
  }
}

export interface AuthorshipChain {
  blocks: AuthorBlock[]
  merkleTree: MerkleNode[]
  rootHash: string
}

export interface MerkleNode {
  hash: string
  left?: MerkleNode
  right?: MerkleNode
  data?: string
}

export interface CryptographicKeys {
  publicKey: string
  privateKey: string
  address: string
  algorithm: 'ECDSA' | 'RSA' | 'Ed25519'
  keyLength: number
  created: Date
  expires?: Date
}

export interface AuthorshipTimestamp {
  blockNumber: number
  transactionHash: string
  timestamp: Date
  confirmations: number
  network: string
}

export interface LegalAttestation {
  id: string
  type: 'notarization' | 'copyright' | 'patent' | 'trademark'
  authority: string
  certificate: string
  jurisdiction: string
  validFrom: Date
  validTo?: Date
  documentHash: string
  authorIdentity: AuthorIdentity
}

export interface AuthorIdentity {
  name: string
  email: string
  publicKey: string
  biometricHash?: string
  verificationLevel: 'basic' | 'verified' | 'certified'
  credentials: Credential[]
  reputation: number
}

export interface Credential {
  type: 'education' | 'employment' | 'certification' | 'publication'
  issuer: string
  title: string
  dateIssued: Date
  verificationUrl?: string
  hash: string
}

export interface AuthorshipMetrics {
  totalWords: number
  totalCharacters: number
  contributionPercentage: number
  editingTime: number
  revisionCount: number
  collaborationScore: number
  originalityScore: number
  firstContribution: Date
  lastContribution: Date
}

export interface PlagiarismCheck {
  id: string
  documentHash: string
  checkDate: Date
  sources: PlagiarismSource[]
  overallSimilarity: number
  uniquenessScore: number
  status: 'clean' | 'similar' | 'plagiarized'
}

export interface PlagiarismSource {
  url: string
  title: string
  similarity: number
  matchedText: string[]
  confidence: number
}

export interface IntellectualPropertyClaim {
  id: string
  type: 'copyright' | 'patent' | 'trademark' | 'trade_secret'
  claimant: AuthorIdentity
  registrationNumber?: string
  registrationDate?: Date
  jurisdiction: string
  description: string
  protectedContent: string
  validUntil?: Date
  proofDocuments: string[]
}

export interface LicenseAgreement {
  id: string
  type: 'CC' | 'MIT' | 'GPL' | 'proprietary' | 'custom'
  version: string
  terms: string
  permissions: Permission[]
  restrictions: Restriction[]
  obligations: Obligation[]
  validFrom: Date
  validTo?: Date
  licensor: AuthorIdentity
  licensee?: AuthorIdentity
}

export interface Permission {
  type: 'read' | 'modify' | 'distribute' | 'commercialize' | 'sublicense'
  conditions?: string[]
}

export interface Restriction {
  type: 'no_commercial' | 'no_derivatives' | 'share_alike' | 'attribution_required'
  description: string
}

export interface Obligation {
  type: 'attribution' | 'share_source' | 'same_license' | 'notice'
  description: string
  required: boolean
}

export interface BlockchainRecord {
  txHash: string
  blockNumber: number
  blockHash: string
  timestamp: Date
  gasUsed: number
  network: 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'custom'
  confirmations: number
  status: 'pending' | 'confirmed' | 'failed'
}
