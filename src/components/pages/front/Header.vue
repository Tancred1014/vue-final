<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <!-- <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
        </button>-->
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav mr-auto">
            <router-link :to="{name: 'Main'}">
              <h3 class="headTitle" href="#/HomePage">可愛動物抱枕</h3>
            </router-link>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'AboutUs' }">
                關於我們
                <span class="sr-only">(current)</span>
              </router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Main' }">
                全部商品
                <span class="sr-only">(current)</span>
              </router-link>
            </li>

            <!-- <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >全部商品</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="#">商品種類1</a>
                <a class="dropdown-item" href="#">商品種類2</a>
                <a class="dropdown-item" href="#">商品種類3</a>
              </div>
            </li>-->
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <router-link :to="{ name: 'Login' }">
              <a class="btn btn-outline-primary mr-1">管理員後台</a>
            </router-link>
          </form>
        </div>
      </div>
    </nav>

    <div class="container">
      <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div
            class="carousel-item header-carousel-item bg-cover active"
            style="background-image: url(https://images.unsplash.com/photo-1506099914961-765be7a97019?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)"
          ></div>
          <div
            class="carousel-item header-carousel-item bg-cover"
            style="background-image: url(https://images.unsplash.com/photo-1572880393162-0518ac760495?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80)"
          ></div>
          <div
            class="carousel-item header-carousel-item bg-cover"
            style="background-image: url(https://images.unsplash.com/photo-1572443490709-e57345f45939?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80)"
          ></div>
        </div>
        <a
          class="carousel-control-prev"
          href="#carouselExampleControls"
          role="button"
          data-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a
          class="carousel-control-next"
          href="#carouselExampleControls"
          role="button"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script></script>
