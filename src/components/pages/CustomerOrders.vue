<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
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
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <!-- <i
                class="fas fa-spinner fa-spin"
                v-if="status.loadingItem === item.id"
              ></i>-->
              查看更多
            </button>
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
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
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
    <!-- 購物車 -->
    <div class="my-5 row justify-content-center">
      <div class="col-md-6">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
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
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 購物車 -->
    <!-- 訂單 -->
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <!-- <form class="col-md-6" @submit.prevent="createOrder"> -->
        <!-- <div class="row"> -->
        <div class="form-group">
          <label for="username">帳號</label>
          <input
            type="text"
            class="form-control"
            name="username"
            v-bind:class="{ 'is-invalid': this.form.err.usernameError }"
            v-model="form.user.name"
            placeholder="Username"
          />(最多10個字)
          <div class="invalid-feedback">{{ this.form.errMsg.userErrMsg }}</div>
        </div>
        <!-- </div> -->
        <!-- <div class="row"> -->
        <div class="form-group">
          <label for="tel">電話</label>
          <input
            type="text"
            class="form-control"
            name="tel"
            v-bind:class="{ 'is-invalid': this.form.err.telError }"
            v-model="form.user.tel"
            placeholder="請輸入電話"
          />
          <div class="invalid-feedback">{{ this.form.errMsg.telErrMsg }}</div>
        </div>
        <!-- </div> -->
        <!-- <div class="row"> -->
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input
            type="text"
            class="form-control"
            name="email"
            v-bind:class="{ 'is-invalid': this.form.err.emailError }"
            v-model="form.user.email"
            placeholder="Email"
          />
          <div class="invalid-feedback">{{ this.form.errMsg.emailErrMsg }}</div>
        </div>
        <!-- </div> -->
        <!-- <div class="row"> -->
        <div class="form-group">
          <label for="address">地址</label>
          <input
            type="text"
            class="form-control"
            name="address"
            v-bind:class="{ 'is-invalid': this.form.err.addressError }"
            v-model="form.user.address"
            placeholder="請輸入地址"
          />
          <div class="invalid-feedback">{{ this.form.errMsg.addressErrMsg }}</div>
        </div>
        <!-- </div> -->
        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea name id class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
      <!-- <button @click="validateData()">aaaa</button> -->
    </div>
    <!-- 訂單 -->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "",
  data() {
    return {
      products: [],
      product: {},
      status: {
        loadingItem: ""
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: "",
        err: {
          usernameError: false,
          telError: false,
          emailError: false,
          addressError: false
        },
        errMsg: {
          userErrMsg: "",
          telErrMsg: "",
          emailErrMsg: "",
          addressErrMsg: ""
        }
      },
      cart: {},
      isLoading: false,
      coupon_code: ""
    };
  },
  watch: {
    "form.user.name": function() {
      var isText = /^[a-zA-Z0-9]+$/;
      if (this.form.user.name.length == 0) {
        this.form.err.usernameError = true;
        this.form.errMsg.userErrMsg = "帳號不得為空";
      } else if (!isText.test(this.form.user.name)) {
        this.form.err.usernameError = true;
        this.form.errMsg.userErrMsg = "請勿包含特殊字元";
      } else if (this.form.user.name.length > 10) {
        this.form.err.usernameError = true;
        this.form.errMsg.userErrMsg = "請勿超過10個字";
      } else {
        this.form.err.usernameError = false;
      }
    },
    "form.user.tel": function() {
      // var isText = /^[a-zA-Z0-9]+$/;
      // var include = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
      // if (!isText.test(this.form.user.tel)) {
      //   this.passwordError = true;
      //   this.passErrMsg = "請勿包含特殊字元";
      // } else
      if (this.form.user.tel.length == 0) {
        this.form.err.telError = true;
        this.form.errMsg.telErrMsg = "電話不得為空";
      } else if (this.form.user.tel.length < 8) {
        this.form.err.telError = true;
        this.form.errMsg.telErrMsg = "電話格式錯誤";
        // } else if (this.form.user.tel.length > 15) {
        //   this.form.err.telError = true;
        //   this.telErrMsg = "請勿超過15個字";
        // } else if (!include.test(this.form.user.tel)) {
        //   this.form.err.telError = true;
        //   this.telErrMsg = "至少包括一個大小寫字母或數字";
      } else {
        this.form.err.telError = false;
      }
    },
    "form.user.email": function() {
      var isMail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      if (this.form.user.email.length == 0) {
        this.form.err.emailError = true;
        this.form.errMsg.emailErrMsg = "email不得為空";
      } else if (!isMail.test(this.form.user.email)) {
        this.form.err.emailError = true;
        this.form.errMsg.emailErrMsg = "email格式錯誤";
      } else {
        this.form.err.emailError = false;
      }
    },
    "form.user.address": function() {
      // var isText = /^[a-zA-Z0-9]+$/;
      // if (!isText.test(this.form.user.address)) {
      //   this.addressError = true;
      //   this.addressErrMsg = "請勿包含特殊字元";
      // } else
      if (this.form.user.address.length == 0) {
        this.form.err.addressError = true;
        this.form.errMsg.addressErrMsg = "地址不得為空";
      } else {
        this.form.err.addressError = false;
      }
    }
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/products`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.products = response.data.products.filter(function(item) {
          return item.is_enabled === 1;
        });
        console.log("products", response);
        vm.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then(response => {
        vm.product = response.data.product;
        $(productModal).modal("show");
        console.log("getProduct", response);
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
        console.log("addtoCart", response);
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
        console.log("getCart", response);
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
    addCouponCode() {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true;
      this.$http.post(url, { data: coupon }).then(response => {
        console.log("coupon", response);
        vm.getCart();
        vm.isLoading = false;

        console.log("form", this.form);
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMAPI}/order`;
      const order = vm.form;
      vm.isLoading = true;

      const errArray = Object.values(vm.form.err);

      const findErr = errArray.find(function(item) {
        return item == true;
      });
      console.log(findErr);
      this.$http.post(url, { data: order }).then(response => {
        if (findErr == true) {
          console.log("欄位不完整");
          vm.isLoading = false;
        } else {
          if (vm.cart.carts.length < 1) {
            console.log("請新增商品");
            vm.isLoading = false;
          } else {
            console.log("訂單已建立", response);
            vm.$router.push(`/customer_checkout/${response.data.orderId}`);
            console.log("order", { data: order });
            vm.getCart();
            vm.isLoading = false;
          }
        }

        // if (response.data.success) {
        //   vm.$router.push(`/customer_checkout/${response.data.orderId}`);
        //   console.log("order", { data: order });
        //   vm.getCart();
        //   vm.isLoading = false;
        // } else {

        // }
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>
