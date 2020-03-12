<template>
  <div class="container">
    <loading :active.sync="isLoading"></loading>
    <div class="row">
      <div class="col-md-3">
        <div class="mt-4 sticky-top">
          <!-- <aside class="col-md-2"> -->
          <ul class="list-group">
            <li class="list-group-item" @click.prevent="getProducts">全部商品</li>
            <!-- :class="{'active': category === ''}"
            @click="byCategory()"-->
            <li class="list-group-item" value="大型" @click.prevent="getLarge">大型</li>
            <!-- :class="{'active': category === '大型'}" -->
            <!-- @click="byCategory(value = '大型')" -->
            <li class="list-group-item" value="中型" @click.prevent="getMedium">中型</li>
            <!-- :class="{'active': category === '中型'}"
            @click="byCategory(value = '中型')"-->
            <li class="list-group-item" value="小型" @click.prevent="getSmall">小型</li>
            <!-- :class="{'active': category === '小型'}"
            @click="byCategory(value = '小型 ')"-->

            <!-- search -->
            <li class="list-group-item p-0">
              <form class="form-inline">
                <input
                  class="form-control w-75 pl-3 rounded-0"
                  type="search"
                  placeholder="搜尋"
                  aria-label="Search"
                  v-model="searchWord"
                  @keyup.enter="searchItem"
                />
                <button
                  class="btn btn-outline-primary w-25 rounded-0 px-0"
                  type="submit"
                  @click.prevent="searchItem"
                >
                  <i class="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
            </li>
          </ul>
          <!-- </aside> -->
        </div>
      </div>

      <!-- </div> -->
      <div class="col-md-9">
        <div class="col-md-4">
          <div class="form-group mt-2 d-flex justify-content-end">
            <label for="sortProducts" class="align-self-center m-0">排序依據</label>
            <select
              class="form-control ml-3"
              id="sortProducts"
              style="max-width: 200px;"
              v-model="sortValue"
              @change="sortProducts"
            >
              <option value="byNew">新品↓</option>
              <option value="byName">名稱↓</option>
              <option value="byPriceLow">價格↓</option>
              <option value="byPriceHigh">價格↑</option>
            </select>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
            <div class="card border-0">
              <div
                style="height: 150px; background-size: cover; background-position: center"
                :style="{ backgroundImage: `url(${item.imageUrl})` }"
              ></div>
              <div class="card-body">
                <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                <h5 class="card-title">
                  <a href="#" class="text-dark">{{ item.title }}</a>
                </h5>
                <p class="card-text">{{ item.content }}</p>
                <div class="d-flex justify-content-between align-items-baseline">
                  <!-- <div class="h5" v-if="!item.price">
                    {{ item.origin_price }} 元
                  </div>-->
                  <div class="h6" v-if="item.price">{{ item.price }} 元</div>
                  <!-- <div class="h5" v-if="item.price">
                    現在只要 {{ item.price }} 元
                  </div>-->
                </div>
              </div>
              <div class="card-footer d-flex">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="getProduct(item.id)"
                >查看更多</button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm ml-auto"
                  @click="addtoCart(item.id)"
                >
                  <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                  加到購物車
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="productModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <img :src="product.imageUrl" class="img-fluid" alt />
                <blockquote class="blockquote mt-3">
                  <p class="mb-0">{{ product.content }}</p>
                  <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                </blockquote>
                <div class="d-flex justify-content-between align-items-baseline">
                  <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                  <!-- <del class="h6" v-if="product.price"
                    >原價 {{ product.origin_price }} 元</del
                  >-->
                  <div class="h4" v-if="product.price">{{ product.price }} 元</div>
                </div>
                <select name class="form-control mt-3" v-model="product.num">
                  <option :value="num" v-for="num in 10" :key="num">選購 {{ num }} {{ product.unit }}</option>
                </select>
              </div>
              <div class="modal-footer">
                <div class="text-muted text-nowrap mr-3">
                  小計
                  <strong>{{ product.num * product.price }}</strong> 元
                </div>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="addtoCart(product.id, product.num)"
                >
                  <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                  加到購物車
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="Page navigation example" v-if="pagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pagination.has_pre }">
              <a
                class="page-link"
                href="#"
                aria-label="Previous"
                @click.prevent="getProducts(pagination.current_page - 1)"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li
              class="page-item"
              v-for="page in pagination.total_pages"
              :key="page"
              :class="{ active: pagination.current_page === page }"
            >
              <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.has_next }">
              <a
                class="page-link"
                href="#"
                aria-label="Next"
                @click.prevent="getProducts(pagination.current_page + 1)"
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="cart-dropdown">
        <button
          class="btn btn-sm btn-cart"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="fa fa-shopping-cart text-secondary fa-2x shoppingcart"></i>
          <span class="badge badge-pill badge-danger">{{ cartLength }}</span>
          <p class="my-0 text-secondary">購物車</p>
        </button>
        <div
          class="dropdown-menu dropdown-menu-right"
          style="min-width: 300px"
          aria-labelledby="dropdownMenuButton"
        >
          <div class="px-4 px-3">
            <h6>已選擇商品</h6>
            <!-- <div class="my-5 row justify-content-center"> -->
            <!-- <div class="col-md-6"> -->
            <table class="table">
              <tbody>
                <tr v-for="item in cart.carts" :key="item.id">
                  <td class="align-middle">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="removeCartItem(item.id)"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                  <td class="align-middle">
                    {{ item.product.title }}
                    <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                  </td>
                  <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                  <td class="align-middle text-right">{{ item.final_total }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right">總計</td>
                  <td class="text-right">{{ cart.total }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                  <td colspan="3" class="text-right text-success">折扣價</td>
                  <td class="text-right text-success">{{ cart.final_total }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- </div> -->
          <a href="#/CheckOut1" class="btn btn-primary btn-block">結帳去</a>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      allProducts: [],
      product: {},
      cart: {},
      pagination: {},
      category: "",
      sortValue: "byNew",
      searchWord: "",
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/products?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products.filter(function(item) {
          return item.is_enabled === 1;
        });
        console.log("商品", response.data);
        vm.isLoading = false;

        // vm.products = response.data.products;
        vm.pagination = response.data.pagination;
      });
    },
    getLarge(page) {
      this.pagination = false;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/products/all`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products.map(function(item) {
          if (item.category === "大型") {
            return item;
          }
          return false;
        });
        vm.products = vm.products.filter(function(item) {
          return item.is_enabled === 1;
        });
        console.log("Large", vm.products);
        vm.isLoading = false;
        // vm.pagination = response.data.pagination;
      });
    },
    getMedium(page) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/products/all`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products.map(function(item) {
          if (item.category === "中型") {
            return item;
          }
          return false;
        });
        vm.products = vm.products.filter(function(item) {
          return item.is_enabled === 1;
        });
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
    },
    getSmall() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/products/all`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products.map(function(item) {
          if (item.category === "小型") {
            return item;
          }
          return false;
        });
        vm.products = vm.products.filter(function(item) {
          return item.is_enabled === 1;
        });
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then(response => {
        vm.product = response.data.product;
        $(productModal).modal("show");
        console.log("卡片", response);
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/cart`;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(url, { data: cart }).then(response => {
        console.log("購物車", response);
        vm.status.loadingItem = "";
        vm.getCart();
        $(productModal).modal("hide");
      });
    },
    getCart() {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.cart = response.data.data;
        // console.log(response);
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then(response => {
        vm.getCart();
        vm.isLoading = false;
      });
    },
    sortProducts() {
      let vm = this;
      if (vm.sortValue === "byPriceLow") {
        vm.products = vm.products.sort((a, b) => {
          return a.price - b.price;
        });
      } else if (vm.sortValue === "byPriceHigh") {
        vm.products = vm.products.sort((a, b) => {
          return -(a.price - b.price);
        });
      } else if (vm.sortValue === "byName") {
        vm.products = vm.products.sort((a, b) => {
          return a.title.localeCompare(b.title, "zh-TW");
        });
      } else {
        this.getProducts();
      }
    },
    searchItem() {
      const vm = this;
      if (vm.searchWord) {
        const searchProduct = vm.products.filter((item, index, array) => {
          return item.title.indexOf(vm.searchWord) >= 0;
        });
        if (searchProduct.length > 0) {
          vm.products = searchProduct;
        } else {
          vm.$bus.$emit("message:push", "沒有搜尋結果，請重新搜尋", "danger");
        }
      } else {
        vm.getProducts();
      }
    },
    mobileBack() {
      $(window).on("hashchange", function() {
        if (window.location.hash !== "#modal") {
          $("#productModal").modal("hide");
        }
      });
    }
  },

  created() {
    this.getProducts();
    this.getCart();
    this.mobileBack();
  },
  computed: {
    cartLength() {
      if (this.cart.carts) {
        return this.cart.carts.length;
      } else {
        return 0;
      }
    }
  }
};
</script>
