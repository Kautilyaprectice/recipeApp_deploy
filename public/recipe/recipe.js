document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    document.getElementById('create-recipe-link').addEventListener('click', loadRecipeForm);
    document.getElementById('browse-recipes-link').addEventListener('click', loadRecipes);
    document.getElementById('profile-link').addEventListener('click', loadProfile);
    document.getElementById('all-recipes').addEventListener('click', loadAllRecipes);

    function loadRecipeForm() {
        mainContent.innerHTML = `
            <h2>Create Recipe</h2>
            <form id="recipe-form">
                <input type="text" id="title" placeholder="Title" required>
                <textarea id="ingredients" placeholder="Ingredients" required></textarea>
                <textarea id="instructions" placeholder="Instructions" required></textarea>
                <input type="text" id="imageUrl" placeholder="Image URL">
                <label for="difficulty">Choose The Difficulty:</label>
                <select id="difficulty" required>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <label for="dietary">Choose The Dietary:</label>
                <select id="dietary" required>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                </select>
                <label for="preparationTime">Choose The Preparation Time:</label>
                <select id="preparationTime" required>
                    <option value="short">Less than 30 minutes</option>
                    <option value="medium">30-60 minutes</option>
                    <option value="long">More than 60 minutes</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        `;
        document.getElementById('recipe-form').addEventListener('submit', handleRecipeSubmit);
    }

    function loadRecipes() {
        mainContent.innerHTML = `
            <h2>Browse Recipes</h2>
            <input type="text" id="search" placeholder="Search recipes...">
            <button id="search-button">Search</button>
            <select id="filter-dietary">
                <option value="">All Dietary Preferences</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
            <select id="filter-difficulty">
                <option value="">All Difficulty Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <select id="filter-time">
                <option value="">All Preparation Times</option>
                <option value="short">Less than 30 minutes</option>
                <option value="medium">30-60 minutes</option>
                <option value="long">More than 60 minutes</option>
            </select>
            <div id="recipe-list"></div>
        `;
        document.getElementById('search-button').addEventListener('click', loadFilteredRecipes);
    }

    function handleRecipeSubmit(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const difficulty = document.getElementById('difficulty').value;
        const dietary = document.getElementById('dietary').value;
        const preparationTime = document.getElementById('preparationTime').value;
        const token = localStorage.getItem('token');

        axios.post('http://localhost:3000/user/recipe', {
            title,
            ingredients,
            instructions,
            imageUrl,
            difficulty,
            dietary,
            preparationTime
        }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Recipe created successfully');
            loadAllRecipes();
        })
        .catch(error => {
            console.error('There was an error creating the recipe!', error);
        });
    }

    function loadAllRecipes() {
        axios.get('http://localhost:3000/recipes')
        .then(response => {
            const data = response.data;
            mainContent.innerHTML = `
                <h2>All Recipes</h2>
                <div id="recipe-list">
                    ${data.map(recipe => `
                        <div class="recipe-item">
                            <h3>${recipe.title}</h3>
                            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                            ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                            <button class="favorite-button" data-id="${recipe.id}">Save to Favorites</button>
                            <button class="add-to-collection-button" data-recipe-id="${recipe.id}">Add to Collection</button>
                        </div>
                    `).join('')}
                </div>
            `;
    
            document.querySelectorAll('.favorite-button').forEach(button => {
                button.addEventListener('click', () => {
                    const recipeId = button.getAttribute('data-id');
                    saveToFavorites(recipeId);
                });
            });
    
            document.querySelectorAll('.add-to-collection-button').forEach(button => {
                button.addEventListener('click', () => {
                    const recipeId = button.getAttribute('data-recipe-id');
                    showCollectionSelector(recipeId);
                });
            });
        })
        .catch(error => {
            console.error('There was an error loading the recipes!', error);
        });
    }

    function showCollectionSelector(recipeId) {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/user/collections', { headers: { 'authorization': token } })
        .then(response => {
            const collections = response.data;
    
            const collectionOptions = collections.map(collection => `
                <option value="${collection.id}">${collection.name}</option>
            `).join('');
    
            const collectionSelect = `
                <div id="collection-select">
                    <label for="select-collection">Select Collection:</label>
                    <select id="select-collection">
                        ${collectionOptions}
                    </select>
                    <button id="add-recipe-to-collection">Add to Collection</button>
                </div>
            `;
    
            mainContent.innerHTML += collectionSelect;
    
            document.getElementById('add-recipe-to-collection').addEventListener('click', () => {
                const selectedCollectionId = document.getElementById('select-collection').value;
                addToCollection(selectedCollectionId, recipeId);
            });
        })
        .catch(error => {
            console.error('There was an error loading the collections for selection!', error);
        });
    }
    
    function addToCollection(collectionId, recipeId) {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3000/user/collections/${collectionId}/recipes`, { recipeId }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Recipe added to collection successfully');
            loadAllRecipes();
        })
        .catch(error => {
            console.error('There was an error adding the recipe to the collection!', error);
        });
    }    
    
    function removeFromCollection(collectionId, recipeId) {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:3000/user/collections/${collectionId}/recipes/${recipeId}`, { headers: { 'authorization': token } })
        .then(() => {
            alert('Recipe removed from collection');
            viewCollection(collectionId);
        })
        .catch(error => {
            console.error('There was an error removing the recipe from the collection!', error);
        });
    }

    function saveToFavorites(recipeId) {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3000/user/favorites`, { recipeId }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Recipe saved to favorites!');
            loadFavoriteRecipes();
        })
        .catch(error => {
            console.error('There was an error saving to favorites!', error);
        });
    }

    function loadFilteredRecipes() {
        const search = document.getElementById('search').value;
        const dietary = document.getElementById('filter-dietary').value;
        const difficulty = document.getElementById('filter-difficulty').value;
        const time = document.getElementById('filter-time').value;

        axios.get('http://localhost:3000/filtered/recipes', {
            params: {
                search,
                dietary,
                difficulty,
                time
            }
        })
        .then(response => {
            const data = response.data;
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = data.map(recipe => `
                <div class="recipe-item">
                    <h3>${recipe.title}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('There was an error loading the recipes!', error);
        });
    }

    function loadProfile() {
        mainContent.innerHTML = `
            <h2>Profile Management</h2>
            <div id="profile-section">
                <h3>Your Profile</h3>
                <form id="profile-form">
                    <input type="text" id="name" placeholder="Name" required>
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="New Password (optional)">
                    <button type="submit">Update Profile</button>
                </form>
                <h3>Contributed Recipes</h3>
                <div id="contributed-recipes"></div>
                <h3>Favorite Recipes</h3>
                <div id="favorite-recipes"></div>
                <button id="create-collection">Create New Collection</button>
                <div id="collections"></div>
            </div>
        `;
        loadUserProfile();
        document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
        document.getElementById('create-collection').addEventListener('click', createCollection);
    }

    function loadUserProfile() {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/user/profile', { headers: { 'authorization': token } })
        .then(response => {
            const profile = response.data;
            document.getElementById('name').value = profile.name;
            document.getElementById('email').value = profile.email;
            loadContributedRecipes();
            loadFavoriteRecipes();
            loadCollections();
        })
        .catch(error => {
            console.error('There was an error loading the profile!', error);
        });
    }

    function loadContributedRecipes() {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/user/profile/contributed', { headers: { 'authorization': token } })
        .then(response => {
            const data = response.data;
            const contributedRecipes = document.getElementById('contributed-recipes');
            contributedRecipes.innerHTML = data.map(recipe => `
                <div class="recipe-item">
                    <h3>${recipe.title}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                    <button class="edit-recipe-button" data-id="${recipe.id}">Edit</button>
                    <button class="delete-recipe-button" data-id="${recipe.id}">Delete</button>
                </div>
            `).join('');
            document.querySelectorAll('.edit-recipe-button').forEach(button => {
                button.addEventListener('click', () => {
                    const recipeId = button.getAttribute('data-id');
                    editRecipe(recipeId);
                });
            });
            document.querySelectorAll('.delete-recipe-button').forEach(button => {
                button.addEventListener('click', () => {
                    const recipeId = button.getAttribute('data-id');
                    deleteRecipe(recipeId);
                });
            });
        })
        .catch(error => {
            console.error('There was an error loading the contributed recipes!', error);
        });
    }

    function loadFavoriteRecipes() {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/user/favorites', { headers: { 'authorization': token } })
        .then(response => {
            const data = response.data;
            const favoriteRecipes = document.getElementById('favorite-recipes');
            if (favoriteRecipes) {
                favoriteRecipes.innerHTML = data.map(recipe => {
    
                    const title = recipe.title || 'Untitled Recipe';
                    const ingredients = recipe.ingredients || 'No ingredients provided';
                    const instructions = recipe.instructions || 'No instructions provided';
                    const imageUrl = recipe.imageUrl;
    
                    return `
                        <div class="recipe-item">
                            <h3>${title}</h3>
                            <p><strong>Ingredients:</strong> ${ingredients}</p>
                            <p><strong>Instructions:</strong> ${instructions}</p>
                            ${imageUrl ? `<img src="${imageUrl}" alt="${title}">` : ''}
                            <button class="remove-favorite-button" data-id="${recipe.id}">Remove from Favorites</button>
                        </div>
                    `;
                }).join('');
    
                document.querySelectorAll('.remove-favorite-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const recipeId = button.getAttribute('data-id');
                        removeFromFavorites(recipeId);
                    });
                });
            }
        })
        .catch(error => {
            console.error('There was an error loading the favorite recipes!', error);
        });
    }               

    function removeFromFavorites(recipeId) {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:3000/user/favorites/${recipeId}`, { headers: { 'authorization': token } })
        .then(() => {
            alert('Recipe removed from favorites');
            loadFavoriteRecipes();
        })
        .catch(error => {
            console.error('There was an error removing the recipe from favorites!', error);
        });
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const token = localStorage.getItem('token');

        axios.put('http://localhost:3000/user/profile', {
            name,
            email,
            password
        }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Profile updated successfully');
            loadUserProfile();
        })
        .catch(error => {
            console.error('There was an error updating the profile!', error);
        });
    }

    function createCollection() {
        const collectionName = prompt('Enter the name of the new collection:');
        if (!collectionName) return;

        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/user/collections', { name: collectionName }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Collection created successfully');
            loadCollections();
        })
        .catch(error => {
            console.error('There was an error creating the collection!', error);
        });
    }

    function loadCollections() {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/user/collections', { headers: { 'authorization': token } })
        .then(response => {
            const collections = response.data;
            const collectionsDiv = document.getElementById('collections');
            if(collectionsDiv){
                if(collections.length > 0){
                    collectionsDiv.innerHTML = collections.map(collection => `
                        <div class="collection-item">
                            <h4>${collection.name}</h4>
                            <button class="view-collection-button" data-id="${collection.id}">View Collection</button>
                        </div>
                    `).join('');
                    document.querySelectorAll('.view-collection-button').forEach(button => {
                        button.addEventListener('click', () => {
                            const collectionId = button.getAttribute('data-id');
                            viewCollection(collectionId);
                        });
                    });
                }else{
                    collectionsDiv.innerHTML = '';
                }
            }
        })
        .catch(error => {
            console.error('There was an error loading the collections!', error);
        });
    }

    function viewCollection(collectionId) {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3000/user/collections/${collectionId}`, { headers: { 'authorization': token } })
        .then(response => {
            const data = response.data;
            if (data.recipes && Array.isArray(data.recipes)) {
                mainContent.innerHTML = `
                    <h2>Collection</h2>
                    <div id="collection-recipes">
                        ${data.recipes.map(recipe => `
                            <div class="recipe-item">
                                <h3>${recipe.title}</h3>
                                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                                ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                mainContent.innerHTML = `
                    <h2>Collection</h2>
                    <p>No recipes found in this collection.</p>
                `;
            }
        })
        .catch(error => {
            console.error('There was an error loading the collection recipes!', error);
        });
    }    

    const token = localStorage.getItem('token');
    if (token) {
        loadAllRecipes();
    }
});
