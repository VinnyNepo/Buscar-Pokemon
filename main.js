// buscar o campo de texto
const input = document.querySelector("#busca");
const input2 = document.querySelector("#buscar");


// buscar o div que vai ficar o retorno dos dados da api
const info = document.querySelector("#info");
const info2 = document.querySelector("#info2");

// adicionar o listener no evento input
input.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const nome = event.target.value; // o que o usuário digitou no campo
    // buscar lá na api do pokedex pela variável nome
    const resultado = await fetch("https://pokeapi.co/api/v2/pokemon/" + nome.toLowerCase());
    // verifica se talquei
    if (!nome) {
      info.innerHTML = "<h1>Digete o nome de um pokemon para continuar</h1>";
      info.style.display = 'block';

  }
    if (!resultado.ok) {
      info.innerHTML = "<h1>Pokemon não encontrado</h1>";
      info.style.display = 'block';

  }
    if (resultado.ok) {
      // converte os dados de retorno do fetch (doidões) para objeto javascript
      const dados = await resultado.json();
      // guardar o resultado em um objeto {}

      // Obter os tipos do Pokémon
      const tipos = dados.types.map((t) => t.type.name);
      const habilidades = dados.abilities.map((t) => t.ability.name);

      // Buscar fraquezas de cada tipo
      const fraquezasSet = new Set();
      for (const tipo of tipos) {
        const tipoResponse = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const tipoDados = await tipoResponse.json();

        // Adicionar os tipos que causam dano dobrado (2x) nos Pokémon do tipo atual
        tipoDados.damage_relations.double_damage_from.forEach((weakness) => {
          fraquezasSet.add(weakness.name);
        });
      }

      // Converter o Set em uma lista ordenada
      const fraquezas = Array.from(fraquezasSet).sort();

      const pokemon = {
        nome: dados.name,
        imagem: dados.sprites.front_default,
        altura: parseInt(dados.height) / 10,
        peso: parseInt(dados.weight) / 10,
        tipos: tipos.join(", "),
        habilidades: habilidades.join(","),
        fraquezas: fraquezas.join(", "),

      };
      info.innerHTML = "<h1>" + pokemon.nome + "</h1>";
      info.innerHTML += '<img src="' + pokemon.imagem + '">';
      info.innerHTML += "<p>Altura: " + pokemon.altura + " metros </p>";
      info.innerHTML += "<p>Peso: " + pokemon.peso + " kg </p>";
      info.innerHTML += "<p>tipo: " + pokemon.tipos + " </p>";
      info.innerHTML += "<p>Habilidades: " + pokemon.habilidades + " </p>";
      info.innerHTML += "<p>Fraquezas: " + pokemon.fraquezas + " </p>";
      info.style.display = 'block';
    }
  }
});

input2.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const habilidade = event.target.value.toLowerCase(); // o que o usuário digitou no campo de busca

    // Buscar na API por Pokémon com a habilidade especificada
    const resultado = await fetch(`https://pokeapi.co/api/v2/ability/${habilidade}`);
    
    if (!habilidade) {
      info2.innerHTML = "<h1>Digete a habilidade de um pokemon para continuar</h1>";
      info2.style.display = 'block';

  }
    if (!resultado.ok) {
      info2.innerHTML = "<h1>Habilidade não encontrada</h1>";
      info2.style.display = 'block';
      return;
    }
    
    const dados = await resultado.json();

    // Verifica se há Pokémon que possuem essa habilidade
    if (dados.pokemon.length > 0) {
      // Pega o primeiro Pokémon da lista de Pokémon que possuem a habilidade
      const primeiroPokemon = dados.pokemon[0].pokemon;
      
      // Busca os dados completos do primeiro Pokémon encontrado
      const pokemonDados = await fetch(primeiroPokemon.url);
      const pokemon = await pokemonDados.json();

      // Obter os tipos do Pokémon
      const tipos = pokemon.types.map((t) => t.type.name);

      // Buscar fraquezas de cada tipo
      const fraquezasSet = new Set();
      for (const tipo of tipos) {
        const tipoResponse = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const tipoDados = await tipoResponse.json();

        // Adicionar os tipos que causam dano dobrado (2x) nos Pokémon do tipo atual
        tipoDados.damage_relations.double_damage_from.forEach((weakness) => {
          fraquezasSet.add(weakness.name);
        });
      }

      // Converter o Set em uma lista ordenada
      const fraquezas = Array.from(fraquezasSet).sort();

      // Criando o objeto pokemonInfo com as informações formatadas
      const pokemonInfo = {
        nome: pokemon.name,
        imagem: pokemon.sprites.front_default,
        altura: parseInt(pokemon.height) / 10,
        peso: parseInt(pokemon.weight) / 10,
        tipos: tipos.join(", "),
        fraquezas: fraquezas.join(", "),
      };

      // Exibir os dados do Pokémon
      info2.innerHTML = "<h1>" + pokemonInfo.nome + "</h1>";
      info2.innerHTML += `<img src="${pokemonInfo.imagem}" alt="${pokemonInfo.nome}">`;
      info2.innerHTML += `<p>Altura: ${pokemonInfo.altura} metros</p>`;
      info2.innerHTML += `<p>Peso: ${pokemonInfo.peso} kg</p>`;
      info2.innerHTML += `<p>Tipo: ${pokemonInfo.tipos}</p>`;
      info2.innerHTML += `<p>Fraquezas: ${pokemonInfo.fraquezas}</p>`;
      info2.style.display = 'block';
    }
  }
});
