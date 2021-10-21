## NodeJS/Express Test API
#### All routes return JSON
#### Run `npm install`, then run server.js file. Front end is on /index.html. All functionality currently works except sorting by categories.
## Available Routes:

### Get All Todos
**/getAllTodos** -- Return all currently saved todos.

### Create New Todo
**/createNewTodo/** -- Takes an object as its parameter. Name and category keys are required, ID is created automatically.

### Update Existing Todo
**/updateTodo/** -- Takes object as its parameter and will replace todo with the same id.

### Delete a Todo
**/deleteTodo/** -- Requires id for Todo, and will remove it from the Todo array.

### Get All Categories
**/getCategories** -- Return all currently saved categories.

### Create New Category
**/newCategory/{category}** -- Creates a new category based on the name. Will not create a new one if it already exists

### Update Existing Category
**/updateCategory/{category}** -- Takes an object as its parameters which include ID and name. Replaces category with new name if it exists.

### Delete Category
**/deleteCategory/{id}** -- Requires an id for the category, and will remove it from the stored categories array.
