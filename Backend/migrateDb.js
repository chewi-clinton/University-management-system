const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const admin = client.db('admin').admin();
    const databases = await admin.listDatabases();
    const dbNames = databases.databases.map(db => db.name);
    
    if (dbNames.includes('university-system')) {
      // Connect to source and destination
      const sourceDb = client.db('university-system');
      const destDb = client.db('university-management');
      
      // Get all collections from source
      const collections = await sourceDb.listCollections().toArray();
      console.log('Collections to migrate:', collections.map(c => c.name));
      
      // Copy each collection
      for (const collection of collections) {
        const collName = collection.name;
        const docs = await sourceDb.collection(collName).find({}).toArray();
        
        if (docs.length > 0) {
          await destDb.collection(collName).deleteMany({}); // Clear destination
          await destDb.collection(collName).insertMany(docs);
          console.log(`✓ Migrated ${collName}: ${docs.length} documents`);
        }
      }
      
      // Drop source database
      await sourceDb.dropDatabase();
      console.log('✅ Deleted university-system database');
      console.log('✅ All data migrated to university-management');
    } else {
      console.log('university-system database not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
})();
