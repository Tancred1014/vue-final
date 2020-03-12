import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/Products'
import Orders from '@/components/pages/Orders';
import CustomerOrder from '@/components/pages/CustomerOrders'
import CustomerCheckout from '@/components/pages/CustomerCheckout'
import Coupons from '@/components/pages/Coupons'



import HomePage from '@/components/pages/front/HomePage'
import Main from '@/components/pages/front/Main'
import AboutUs from '@/components/pages/front/AboutUs'
import CheckOut1 from '@/components/pages/front/CheckOut1'
import CheckOut2 from '@/components/pages/front/CheckOut2'
// import CheckOut3 from '@/components/pages/front/CheckOut3'


import axios from "axios";

Vue.use(Router)

let router = new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'dashboard',
      component: Dashboard,
      children: [{
          path: 'Products',
          name: 'Products',
          component: Products,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'Coupons',
          name: 'Coupons',
          component: Coupons,
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: {
            requiresAuth: true
          },
        },
      ]
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [{
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },

      ]
    },
    {
      path: '/HomePage',
      name: 'HomePage',
      component: HomePage,
      children: [{
          path: '/Main',
          name: 'Main',
          component: Main,
        },
        {
          path: '/AboutUs',
          name: 'AboutUs',
          component: AboutUs,
        },
        {
          path: '/CheckOut1',
          name: 'CheckOut1',
          component: CheckOut1,
        },
        {
          path: '/CheckOut2/:orderId',
          name: 'CheckOut2',
          component: CheckOut2,
        },
        // {
        //   path: '/CheckOut3',
        //   name: 'CheckOut3',
        //   component: CheckOut3,
        // },
      ]
    },

    {
      path: '/*',
      redirect: '/login'
    },
  ],
});


router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next);
  // ...
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    axios.post(api).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
});

export default router;