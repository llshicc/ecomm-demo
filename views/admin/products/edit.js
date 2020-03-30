const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = function productEditTemplate({ product, errors } = {}) {
  return layout({
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Edit</h1>
          <form method="POST" enctype="multipart/form-data" action="/admin/products/${
            product.id
          }?_method=PUT">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Title" name="title" value="${
                product ? product.title : ''
              }" required>
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>
            
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price" value="${
                product ? product.price : ''
              }" required>
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            
            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
              <p class="help is-danger">${getError(errors, 'image')}</p>
            </div>
            <br />
            <button class="button is-primary">Submit</button>
          </form>
        </div>
      </div>
    `
  });
};
