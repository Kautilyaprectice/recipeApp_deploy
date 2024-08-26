document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    document.getElementById('admin-user-management-link').addEventListener('click', loadUserManagement);
    document.getElementById('admin-recipe-management-link').addEventListener('click', loadRecipeManagement);
    document.getElementById('recipe-dashboard-link').addEventListener('click', () => {
        window.location.href = "../recipe/recipe.html";
    })

    function loadUserManagement() {
        axios.get('https://recipe-management-cdmeg0wf8-kautilya-tiwaris-projects.vercel.app/admin/users')
            .then(response => {
                const users = response.data;
                mainContent.innerHTML = `
                    <h2>User Management</h2>
                    <div id="user-list">
                        ${users.map(user => `
                            <div class="user-item">
                                <p><strong>${user.name}</strong> (${user.email})</p>
                                <button class="ban-user-button" data-id="${user.id}">Ban User</button>
                                <button class="approve-user-button" data-id="${user.id}" ${user.isApproved ? 'disabled' : ''}>Approve User</button>
                            </div>
                        `).join('')}
                    </div>
                `;

                document.querySelectorAll('.ban-user-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const userId = button.getAttribute('data-id');
                        banUser(userId);
                    });
                });

                document.querySelectorAll('.approve-user-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const userId = button.getAttribute('data-id');
                        approveUser(userId);
                    });
                });
            })
            .catch(error => {
                console.error('Error loading user management:', error);
            });
    }

    function banUser(userId) {
        axios.post(`https://recipe-management-cdmeg0wf8-kautilya-tiwaris-projects.vercel.app/admin/users/${userId}/ban`)
            .then(() => {
                alert('User banned successfully');
                loadUserManagement();
            })
            .catch(error => {
                console.error('Error banning user:', error);
            });
    }

    function approveUser(userId) {
        axios.post(`https://recipe-management-cdmeg0wf8-kautilya-tiwaris-projects.vercel.app/admin/users/${userId}/approve`)
            .then(() => {
                alert('User approved successfully');
                loadUserManagement();
            })
            .catch(error => {
                console.error('Error approving user:', error);
            });
    }

    function loadRecipeManagement() {
        axios.get('https://recipe-management-cdmeg0wf8-kautilya-tiwaris-projects.vercel.app/admin/recipes')
            .then(response => {
                const recipes = response.data;
                mainContent.innerHTML = `
                    <h2>Recipe Management</h2>
                    <div id="recipe-list">
                        ${recipes.map(recipe => `
                            <div class="recipe-item">
                                <p><strong>${recipe.title}</strong> by ${recipe.user.name}</p>
                                <button class="delete-recipe-button" data-id="${recipe.id}">Delete Recipe</button>
                            </div>
                        `).join('')}
                    </div>
                `;

                document.querySelectorAll('.delete-recipe-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const recipeId = button.getAttribute('data-id');
                        deleteRecipe(recipeId);
                    });
                });
            })
            .catch(error => {
                console.error('Error loading recipe management:', error);
            });
    }

    function deleteRecipe(recipeId) {
        axios.delete(`https://recipe-management-cdmeg0wf8-kautilya-tiwaris-projects.vercel.app/admin/recipes/${recipeId}`)
            .then(() => {
                alert('Recipe deleted successfully');
                loadRecipeManagement();
            })
            .catch(error => {
                console.error('Error deleting recipe:', error);
            });
    }
});