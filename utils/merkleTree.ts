/**
 * MerkleTree implementation for ChainPaper
 * Used for creating verifiable document history with authorship proofs
 */

// Define types for the tree structure
interface DocumentLeaf {
  hash: string;
  author: string;
  timestamp: string;
  index: number;
}

interface ProofStep {
  position: 'left' | 'right';
  hash: string;
}

interface MerkleTreeData {
  leaves: DocumentLeaf[];
  root: string;
  timestamp?: string;
}

class MerkleTree {
  leaves: DocumentLeaf[];
  tree: string[][];
  root: string | null;

  constructor() {
    this.leaves = [];
    this.tree = [];
    this.root = null;
  }

  /**
   * Add a new leaf to the tree
   * @param {string} hash - The hash of the content
   * @param {string} author - The author identifier
   * @param {string} timestamp - ISO timestamp of the edit
   */
  addLeaf(hash: string, author: string, timestamp: string): DocumentLeaf {
    const leaf: DocumentLeaf = {
      hash,
      author,
      timestamp,
      index: this.leaves.length
    };
    
    this.leaves.push(leaf);
    this.buildTree();
    return leaf;
  }

  /**
   * Build the Merkle Tree from leaves
   */
  async buildTree(): Promise<void> {
    if (this.leaves.length === 0) {
      this.root = null;
      this.tree = [];
      return;
    }

    // Start with the leaves
    const tree: string[][] = [this.leaves.map(leaf => leaf.hash)];
    let level = 0;

    // Build the tree upward until we reach the root
    while (tree[level].length > 1) {
      level++;
      tree[level] = [];
      
      for (let i = 0; i < tree[level - 1].length; i += 2) {
        if (i + 1 < tree[level - 1].length) {
          // Combine pairs of nodes
          const combined = this.hashPair(tree[level - 1][i], tree[level - 1][i + 1]);
          tree[level].push(await combined);
        } else {
          // Odd number of nodes, promote the last one
          tree[level].push(tree[level - 1][i]);
        }
      }
    }

    this.tree = tree;
    this.root = tree[tree.length - 1][0];
  }

  /**
   * Hash a pair of nodes together
   * @param {string} left - Left node hash
   * @param {string} right - Right node hash
   * @returns {string} - Combined hash
   */
  async hashPair(left: string, right: string): Promise<string> {
    const combined = left + right;
    const msgUint8 = new TextEncoder().encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a proof for a specific leaf
   * @param {number} index - The index of the leaf
   * @returns {ProofStep[] | null} - The proof path
   */
  generateProof(index: number): ProofStep[] | null {
    if (index < 0 || index >= this.leaves.length) {
      return null;
    }

    const proof: ProofStep[] = [];
    let currentIndex = index;

    for (let level = 0; level < this.tree.length - 1; level++) {
      const isRightNode = currentIndex % 2 === 0;
      const siblingIndex = isRightNode ? currentIndex + 1 : currentIndex - 1;

      if (siblingIndex < this.tree[level].length) {
        proof.push({
          position: isRightNode ? 'right' : 'left',
          hash: this.tree[level][siblingIndex]
        });
      }

      // Move up to the parent index
      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  /**
   * Verify a proof for a specific leaf
   * @param {string} leafHash - The hash of the leaf
   * @param {ProofStep[]} proof - The proof path
   * @returns {boolean} - Whether the proof is valid
   */
  async verifyProof(leafHash: string, proof: ProofStep[]): Promise<boolean> {
    let currentHash = leafHash;

    for (const step of proof) {
      if (step.position === 'left') {
        currentHash = await this.hashPair(step.hash, currentHash);
      } else {
        currentHash = await this.hashPair(currentHash, step.hash);
      }
    }

    return currentHash === this.root;
  }

  /**
   * Export the tree for storage
   * @returns {MerkleTreeData} - The serialized tree
   */
  export(): MerkleTreeData {
    return {
      leaves: this.leaves,
      root: this.root || '',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Import a previously exported tree
   * @param {MerkleTreeData} data - The serialized tree
   */
  import(data: MerkleTreeData): void {
    if (!data || !data.leaves || !data.root) {
      throw new Error('Invalid tree data');
    }

    this.leaves = data.leaves;
    this.root = data.root;
    this.buildTree();
  }
}

export default MerkleTree;