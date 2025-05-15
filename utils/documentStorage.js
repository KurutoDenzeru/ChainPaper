/**
 * DocumentStorage service for ChainPaper
 * Handles local storage operations and document versioning
 */

import MerkleTree from './merkleTree';

class DocumentStorage {
  constructor() {
    this.merkleTree = new MerkleTree();
    this.documentKey = 'chainpaper-document';
    this.historyKey = 'chainpaper-history';
    this.initialized = false;
  }

  /**
   * Initialize storage and load existing data
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Load document history if exists
      const historyData = localStorage.getItem(this.historyKey);
      if (historyData) {
        const history = JSON.parse(historyData);
        this.merkleTree.import(history.merkleTree);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing document storage:', error);
    }
  }

  /**
   * Save document with versioning
   * @param {Object} document - The document to save
   * @param {string} document.content - Document content
   * @param {string} document.hash - Content hash
   * @param {string} document.author - Author identifier
   */
  async saveDocument(document) {
    if (!this.initialized) await this.initialize();
    
    try {
      // Add to merkle tree for versioning
      const leaf = this.merkleTree.addLeaf(
        document.hash,
        document.author || 'anonymous',
        document.timestamp || new Date().toISOString()
      );
      
      // Save document to localStorage
      localStorage.setItem(this.documentKey, JSON.stringify(document));
      
      // Save history with merkle tree
      const history = {
        merkleTree: this.merkleTree.export(),
        lastModified: new Date().toISOString()
      };
      localStorage.setItem(this.historyKey, JSON.stringify(history));
      
      return leaf;
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  /**
   * Load the current document
   * @returns {Object|null} - The loaded document or null if not found
   */
  loadDocument() {
    try {
      const documentData = localStorage.getItem(this.documentKey);
      return documentData ? JSON.parse(documentData) : null;
    } catch (error) {
      console.error('Error loading document:', error);
      return null;
    }
  }

  /**
   * Get document history
   * @returns {Array} - Array of document versions
   */
  getHistory() {
    if (!this.initialized) this.initialize();
    return this.merkleTree.leaves;
  }

  /**
   * Export document with proof
   * @returns {Object} - Document with merkle proof
   */
  exportWithProof() {
    if (!this.initialized) this.initialize();
    
    const document = this.loadDocument();
    if (!document) return null;
    
    return {
      document,
      merkleRoot: this.merkleTree.root,
      history: this.merkleTree.leaves,
      exportTime: new Date().toISOString()
    };
  }
  
  /**
   * Import document with its Merkle tree data
   * @param {Object} importData - The imported document data
   * @returns {boolean} - Whether the import was successful
   */
  importDocument(importData) {
    try {
      if (!importData || !importData.document || !importData.merkleRoot || !importData.history) {
        throw new Error('Invalid import data structure');
      }
      
      // Import the Merkle tree
      this.merkleTree.import({
        leaves: importData.history,
        root: importData.merkleRoot
      });
      
      // Save the document
      localStorage.setItem(this.documentKey, JSON.stringify(importData.document));
      
      // Save history with merkle tree
      const history = {
        merkleTree: this.merkleTree.export(),
        lastModified: new Date().toISOString()
      };
      localStorage.setItem(this.historyKey, JSON.stringify(history));
      
      return true;
    } catch (error) {
      console.error('Error importing document:', error);
      return false;
    }
  }
  
  /**
   * Verify document authorship
   * @param {string} contentHash - The hash of the current content
   * @returns {Object} - Verification result with status and message
   */
  verifyAuthorship(contentHash) {
    if (!this.initialized) this.initialize();
    
    try {
      // Check if the hash exists in the Merkle tree
      const history = this.getHistory();
      const matchingEntry = history.find(entry => entry.hash === contentHash);
      
      if (!matchingEntry) {
        return {
          verified: false,
          message: 'Document hash not found in history.'
        };
      }
      
      return {
        verified: true,
        message: 'Document authorship verified successfully!',
        author: matchingEntry.author,
        timestamp: matchingEntry.timestamp
      };
    } catch (error) {
      console.error('Error verifying authorship:', error);
      return {
        verified: false,
        message: 'Error verifying document: ' + error.message
      };
    }
  }

  /**
   * Clear all document data
   */
  clearStorage() {
    localStorage.removeItem(this.documentKey);
    localStorage.removeItem(this.historyKey);
    this.merkleTree = new MerkleTree();
  }
}

// Create singleton instance
const documentStorage = new DocumentStorage();
export default documentStorage;