const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = function productNewTamplate({ errors }) {
  return layout({
    content: `
    <form method="POST" enctype="multipart/form-data">
      <input type="text" name="name" placeholder="Product name" />
      <input type="number" name="price" min="1" placeholder="Price" />
      <input type="file" name="image" />
      <button>Submit</button>
    </form>
    `
  });
};
