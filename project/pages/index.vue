<template>
  <div>
    <div class="relative h-[300px] md:h-[500px] bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')">
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="text-center text-white px-4">
          <h1 class="text-3xl md:text-5xl font-bold mb-4">Bienvenue chez Nous</h1>
          <p class="text-lg md:text-xl mb-8">Une expérience culinaire unique</p>
          <Button label="Réserver une table" class="p-button-rounded p-button-lg" />
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <template #title>Notre Carte</template>
          <template #content>
            <p class="mb-4">Découvrez notre sélection de plats préparés avec des produits frais et locaux.</p>
            <NuxtLink to="/menu">
              <Button label="Voir la carte" class="p-button-outlined w-full md:w-auto" />
            </NuxtLink>
          </template>
        </Card>

        <Card>
          <template #title>Nos Boissons</template>
          <template #content>
            <p class="mb-4">Découvrez notre sélection de boissons préparées avec des produits frais et locaux.</p>
            <NuxtLink to="/drinks">
              <Button label="Voir la carte" class="p-button-outlined w-full md:w-auto" />
            </NuxtLink>
          </template>
        </Card>

        <Card>
          <template #title>Événements</template>
          <template #content>
            <p class="mb-4">Consultez nos prochains événements et soirées spéciales.</p>
            <NuxtLink to="/events">
              <Button label="Voir les événements" class="p-button-outlined w-full md:w-auto" />
            </NuxtLink>
          </template>
        </Card>

        <Card>
          <template #title>Contact</template>
          <template #content>
            <p class="mb-4">Réservez une table ou contactez-nous pour plus d'informations.</p>
            <NuxtLink to="/contact">
              <Button label="Nous contacter" class="p-button-outlined w-full md:w-auto" />
            </NuxtLink>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>