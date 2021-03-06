import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js'

let productModal = {};
let delProductModal = null;

const app = createApp({
    components: {
        pagination
    },
    data() {
        return{
            api: 'https://vue3-course-api.hexschool.io/api',
            path: 'alphatest',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
            pagination: {}
        }
    },
    methods: {
        getData(page = 1) {
            const url = `${this.api}/${this.path}/admin/products?page=${page}`;
            axios.get(url).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                } else {
                    alert(res.data.message);
                }
            })
        },
        updateProduct(tempProduct) {
            let url =`${this.api}/${this.path}/admin/product`;
            let http = 'post';
            if(!this.isNew) {
                url = `${this.api}/${this.path}/admin/product/${tempProduct.id}`;
                http = 'put';
            }

            axios[http](url, {data:tempProduct}).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    productModal.hide();
                    this.getData();
                } else {
                    alert(res.data.message);
                }
            })
        },
        openModal(isNew, item) {
            if(isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if(isNew === 'edit') {
                this.tempProduct = {...item};
                this.isNew = false;
                productModal.show();
            } else if(isNew === 'delete') {
                this.tempProduct = {...item};
                delProductModal.show()
            }
        },
        delProduct() {
            const url = `${this.api}/${this.path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                } else {
                    alert(res.data.message);
                }
            })
        }

    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        })
        const token =document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('Please login');
            window.location = 'login.html';
        }
        axios.defaults.headers.common.Authorization = token; //??????cookie??????
        this.getData();
    }
});

app.component('productModal', {
    props: ['tempProduct'],
    template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span v-if="isNew">????????????</span>
            <span v-else>????????????</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                  <label for="imageUrl">????????????</label>
                  <input v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="?????????????????????">
                  <img class="img-fluid" :src="tempProduct.imageUrl">
                </div>
                <div class="mb-1">????????????</div>
                <div v-if="Array.isArray(tempProduct.imagesUrl)">
                  <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                    <div class="form-group">
                      <label for="imageUrl">????????????</label>
                      <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control"
                        placeholder="?????????????????????">
                    </div>
                    <img class="img-fluid" :src="image">
                  </div>
                  <div
                    v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                    <button class="btn btn-outline-primary btn-sm d-block w-100"
                      @click="tempProduct.imagesUrl.push('')">
                      ????????????
                    </button>
                  </div>
                  <div v-else>
                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                      ????????????
                    </button>
                  </div>
                </div>
                <div v-else>
                  <button class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="createImages">
                    ????????????
                  </button>
                </div>
              </div>
            <div class="col-sm-8">
              <div class="form-group">
                <label for="title">??????</label>
                <input id="title" type="text" class="form-control" placeholder="???????????????" v-model="tempProduct.title">
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="category">??????</label>
                  <input id="category" type="text" class="form-control" placeholder="???????????????"
                    v-model="tempProduct.category">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">??????</label>
                  <input id="unit" type="text" class="form-control" placeholder="???????????????" v-model="tempProduct.unit">
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="origin_price">??????</label>
                  <input id="origin_price" type="number" min="0" class="form-control" placeholder="???????????????"
                    v-model.number="tempProduct.origin_price">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">??????</label>
                  <input id="price" type="number" min="0" class="form-control" v-model.number="tempProduct.price"
                    placeholder="???????????????">
                </div>
              </div>
              <hr>

              <div class="form-group">
                <label for="description">????????????</label>
                <textarea id="description" type="text" class="form-control" placeholder="?????????????????????"
                  v-model="tempProduct.description">
                  </textarea>
              </div>
              <div class="form-group">
                <label for="content">????????????</label>
                <textarea id="description" type="text" class="form-control" placeholder="?????????????????????"
                  v-model="tempProduct.content">
                  </textarea>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input id="is_enabled" class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled"
                    :true-value="1" :false-value="0">
                  <label class="form-check-label" for="is_enabled">????????????</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            ??????
          </button>
          <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)">
            ??????
          </button>
        </div>
      </div>
    </div>
  </div>`,
  methods: {
    addImgs() {
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
    }
}})

app.mount('#app');