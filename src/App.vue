<template>
  <div id="app" class="d-flex flex-column">
    <nav id="nav" class="navbar navbar-dark bg-primary">
      <div class="container">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Search Images</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container flex-grow">
      <div class="col-12">
        <router-view/>
      </div>
    </div>
    <footer class="footer mt-auto bg-dark text-light text-center">
      <div class="container">
        All images curtesy of NASA. Space by Flatart from the Noun Project.
      </div>
    </footer>
  </div>
</template>
