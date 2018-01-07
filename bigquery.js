const BigQuery = require('@google-cloud/bigquery');
// Code from @google-cloud/bigquery samples
exports.insertRowsAsStream = (datasetId, tableId, rows, projectId) => {
  // Example rows 
  // const rows = [{name: "Tom", age: 30}, {name: "Jane", age: 32}];

  const bigquery = new BigQuery({
    projectId: projectId,
  });

  return bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    .then(() => {
      console.log(`Inserted ${rows.length} rows`);
    })
    .catch(err => {
      if (err && err.name === 'PartialFailureError') {
        if (err.errors && err.errors.length > 0) {
          console.log('Insert errors:');
          err.errors.forEach(err => console.error(err));
        }
      } else {
        console.error('ERROR:', err);
      }
    });
}