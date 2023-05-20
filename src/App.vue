<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach(el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>

    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <RouterLink class="navbar-item" to="/">
          PolyMovies
        </RouterLink>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <RouterLink to="/users" class="navbar-item">
            Utilisateurs
          </RouterLink>

          <RouterLink to="/films" class="navbar-item">
            Films
          </RouterLink>

          <RouterLink to="/genres" class="navbar-item">
            Genres
          </RouterLink>

          <RouterLink to="/cinemas" class="navbar-item">
            Cinémas
          </RouterLink>

          <RouterLink to="/sessions" class="navbar-item">
            Scéances
          </RouterLink>
          <RouterLink to="/bookings" class="navbar-item">
            Réservations
          </RouterLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <RouterLink to="/users/register" class="button is-primary">
                Inscription
              </RouterLink>
              <RouterLink to="/users/login" class="button is-info">
                Connexion
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div class="container">
    <RouterView />
  </div>

  <footer>
    <p>Author: Suzanne R.</p>
  </footer>
</template>
