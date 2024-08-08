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
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .catch(error => {
            console.error('There was an error loading the recipes!', error);
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
            </div>
        `;
        loadUserProfile();
        document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
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
            const contributedList = document.getElementById('contributed-recipes');
            contributedList.innerHTML = data.map(recipe => `
                <div class="recipe-item">
                    <h3>${recipe.title}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                    <button class="edit-button" data-id="${recipe.id}">Edit Recipe</button>
                    <button class="delete-button" data-id="${recipe.id}">Delete Recipe</button>
                </div>
            `).join('');

            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', () => {
                    const recipeId = button.getAttribute('data-id');
                    editRecipe(recipeId);
                });
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', () => {
                    const recipeId = button.getAttribute('data-id');
                    deleteRecipe(recipeId);
                });
            });
        })
        .catch(error => {
            console.error('There was an error loading contributed recipes!', error);
        });
    }

    function editRecipe(recipeId) {
        axios.get(`http://localhost:3000/recipe/${recipeId}`)
            .then(response => {
                const recipe = response.data;
                loadRecipeForm();
                document.getElementById('title').value = recipe.title;
                document.getElementById('ingredients').value = recipe.ingredients;
                document.getElementById('instructions').value = recipe.instructions;
                document.getElementById('imageUrl').value = recipe.imageUrl;
                document.getElementById('difficulty').value = recipe.difficulty;
                document.getElementById('dietary').value = recipe.dietary;
                document.getElementById('preparationTime').value = recipe.preparationTime;

                const form = document.getElementById('recipe-form');
                form.removeEventListener('submit', handleRecipeSubmit);
                form.addEventListener('submit', event => handleRecipeUpdate(event, recipeId));
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    alert('Recipe not found');
                } else {
                    console.error('There was an error fetching the recipe!', error);
                }
            });
    }

    function handleRecipeUpdate(event, recipeId) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const difficulty = document.getElementById('difficulty').value;
        const dietary = document.getElementById('dietary').value;
        const preparationTime = document.getElementById('preparationTime').value;
        const token = localStorage.getItem('token');

        axios.put(`http://localhost:3000/recipe/${recipeId}`, {
            title,
            ingredients,
            instructions,
            imageUrl,
            difficulty,
            dietary,
            preparationTime
        }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Recipe updated successfully');
            loadAllRecipes();
        })
        .catch(error => {
            console.error('There was an error updating the recipe!', error);
        });
    }

    function deleteRecipe(recipeId) {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:3000/recipe/${recipeId}`, { headers: { 'authorization': token } })
            .then(() => {
                alert('Recipe deleted successfully');
                loadAllRecipes();
            })
            .catch(error => {
                console.error('There was an error deleting the recipe!', error);
            });
    }

    function loadFavoriteRecipes() {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/user/profile/favorites', { headers: { 'authorization': token } })
        .then(response => {
            const data = response.data;
            const favoriteList = document.getElementById('favorite-recipes');
            favoriteList.innerHTML = data.map(recipe => `
                <div class="recipe-item">
                    <h3>${recipe.title}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('There was an error loading favorite recipes!', error);
        });
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        axios.put('http://localhost:3000/user/profile', {
            name,
            email,
            password
        }, { headers: { 'authorization': token } })
        .then(() => {
            alert('Profile updated successfully');
        })
        .catch(error => {
            console.error('There was an error updating the profile!', error);
        });
    }

    const token = localStorage.getItem('token');
    if (token) {
        loadAllRecipes();
    }
});
