<template>
  <div class="bg-white shadow rounded-lg p-6 mt-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">How to Use ChainPaper</h2>
    
    <div class="space-y-4 text-gray-700">
      <div>
        <h3 class="text-lg font-medium text-gray-800">1. Creating Content</h3>
        <p>Use the rich text editor to create your whitepaper content. The editor supports formatting options like headings, lists, and more.</p>
      </div>
      
      <div>
        <h3 class="text-lg font-medium text-gray-800">2. Real-time Collaboration</h3>
        <p>Multiple users can edit the document simultaneously. Each user is assigned a random color to identify their contributions.</p>
      </div>
      
      <div>
        <h3 class="text-lg font-medium text-gray-800">3. Saving Your Work</h3>
        <p>Click the "Save" button to store your document locally. This also creates a cryptographic proof of your contribution.</p>
      </div>
      
      <div>
        <h3 class="text-lg font-medium text-gray-800">4. Exporting Documents</h3>
        <p>Use the "Export" button to download your document as a JSON file, which includes the content and cryptographic proofs of authorship.</p>
      </div>
      
      <div>
        <h3 class="text-lg font-medium text-gray-800">5. Verifying Authorship</h3>
        <p>Each edit generates a unique hash that is added to a Merkle Tree. The document history shows all contributions with timestamps and author information.</p>
      </div>
    </div>
    
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="text-md font-medium text-blue-800 mb-2">About Trustless Verification</h3>
      <p class="text-sm text-blue-700">
        ChainPaper uses cryptographic hashing (SHA-256) and Merkle Trees to create tamper-proof records of document edits. 
        This allows contributors to prove authorship without relying on a central authority.
      </p>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for this component
</script>