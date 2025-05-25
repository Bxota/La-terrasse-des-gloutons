<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-gray-300 shadow-md">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <Image src="/img/logo_accueil.png" alt="Image" width="200" />
          <!-- <NuxtLink to="/" class="text-xl md:text-2xl font-bold text-gray-800">
            LA TERRASSE DES GLOUTONS
          </NuxtLink> -->
          <div class="flex flex-wrap gap-4">
            <NuxtLink to="/menu" class="text-gray-600 hover:text-gray-900">Carte</NuxtLink>
            <NuxtLink to="/drinks" class="text-gray-600 hover:text-gray-900">Boissons</NuxtLink>
            <NuxtLink to="/events" class="text-gray-600 hover:text-gray-900">Événements</NuxtLink>
            <NuxtLink to="/contact" class="text-gray-600 hover:text-gray-900">Contact</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <NuxtPage />
    </main>

    <footer class="bg-gray-800 text-white mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
            <p>Lundi - Vendredi: 11h30 - 22h30</p>
            <p>Samedi - Dimanche: 11h30 - 23h30</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <p>123 Rue du Restaurant</p>
            <p>75000 Paris</p>
            <p>Tél: 01 23 45 67 89</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div class="flex space-x-4">
              <a href="#" class="hover:text-gray-300"><i class="pi pi-facebook"></i></a>
              <a href="#" class="hover:text-gray-300"><i class="pi pi-instagram"></i></a>
              <a href="#" class="hover:text-gray-300"><i class="pi pi-twitter"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>