let username=window.prompt("Enter your name")
let email=window.prompt("Enter email")
let pass=window.prompt("Enter Password")
let tenant_id="97a56a18-8585-4efd-9bbf-b78d6dea7ab8"
let backend_url="http://localhost:8080/query"
let user_uuid
let todo_table_id="e68305af-fd43-477f-baa2-2d99cd2c2cc4"
let init=async()=>{
    //await Signup()
    
    
    await Signin()
    await GetTodo()
}
init()

async function Signup(){
    let query = `
    mutation Signup($input: Signup!) {
        Signup(input: $input)
    }
    `;

    let variables = {
    input: {
        tenant_id: tenant_id,
        username: username,
        mail: email,
        pass: pass
    }
    };
    try {
       
        let res=await fetch(backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            })
        
        let data=await res.json();
        if (!res.ok){
            console.log("faile to signup")
            console.log(data)
            return
        }
        console.log(data)
    } catch (error) {
        console.log("error while signup")
        console.log(error)
    }
}
async function Signin(){
    let query = `
        mutation Signin($input: Signin!) {
            Signin(input: $input) {
                UUID
                ok
            }
        }
    `;

    let variables = {
    input: {
        tenant_id: tenant_id,
        username: username,
        mail: email,
        pass: pass
    }
    };
    try {
       
        let res=await fetch(backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            })
        
        let data=await res.json();
        if (!res.ok){
            console.log("faile to signin")
            console.log(data)
            return
        }
        console.log()
        user_uuid= data.data.Signin.UUID
    } catch (error) {
        console.log("error while sigin")
        console.log(error)
    }
}

async function Addtodo(){
    let input=document.getElementById("input")
    let todo_name=input.value
    
    let id=await SaveTodo(todo_name)

    AppendToList(todo_name,id)
}

function AppendToList(todo_name,id){
    let list=document.getElementsByClassName("list")[0]
    let new_li=document.createElement('li')
    let text = document.createElement("span");
    text.innerText = todo_name;

    new_li.appendChild(text);

    list.appendChild(new_li)
    new_li.id = id;
    new_li.className="list-item"

    AddUpdateButton(new_li,id)
    AddDeleteButton(new_li,id)
}

function AddDeleteButton(li_item,id){
    let delete_button=document.createElement("button")
    delete_button.innerText="X"
    delete_button.addEventListener("click",async(e)=>{
        await DeleteTodo(id)
        li_item.remove();
    })

    li_item.appendChild(delete_button)
}

async function DeleteTodo(rows_id) {
    let rows={
        row_id: rows_id,
        table_Id: todo_table_id,
        table_name: "todo"
    }
    const query = `
        mutation DeleteTenantUserRow($input: DeleteTenantUserRow!) {
            DeleteTenantUserRow(input: $input)
        }
    `;

    const variables = {
        input: {
            tenant_id: tenant_id,
            tenant_user_uuid: user_uuid,

            data: rows
        }
    };

    try {
        const res = await fetch(backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const result = await res.json();

        if (!res.ok) {
            console.log("Failed to delete");
            console.log(result);
            return;
        }

        console.log("Delete result:", result);

    } catch (error) {
        console.log("Error while deleting:", error);
    }
}

function AddUpdateButton(item, id) {
    let button = document.createElement("button");
    button.innerText = "Update";

    button.addEventListener("click", () => {
        // Create modal
        let modal = document.createElement("div");
        modal.className = "modal";

        // Create input
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter new todo";

        // Create update button
        let updateButton = document.createElement("button");
        updateButton.innerText = "Update";

        // Create cancel button
        let cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";

        // Update
        updateButton.addEventListener("click", async () => {
            let newValue = input.value;

            if (newValue.trim() === "") {
                return;
            }

            item.firstChild.textContent = newValue;

            modal.remove();

            
            await UpdateTodo(id, newValue);

            item.querySelector("span").innerText = newValue;
        });

        cancelButton.addEventListener("click", () => {
            modal.remove();
        });

        modal.appendChild(input);
        modal.appendChild(updateButton);
        modal.appendChild(cancelButton);

        item.appendChild(modal);

        input.focus();
    });

    item.appendChild(button);
}

async function UpdateTodo(row_id, newValue) {
    const query = `
        mutation UpdateTenantUserRow($input: UpdateTenantUserRow!) {
            UpdateTenantUserRow(input: $input) {
                id
                data
            }
        }
    `;

    const variables = {
        input: {
            user_Id: tenant_id,
            tenant_user_uuid: user_uuid,
            table_Id: todo_table_id,
            table_name: "todo",

            row_id: row_id,

            path: [
                {
                    Path: ["todo_name"],
                    Value: newValue
                }
            ]
        }
    };

    try {
        const res = await fetch(backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const data = await res.json();

        if (!res.ok) {
            console.log("Failed to update todo");
            console.log(data);
            return;
        }

        console.log("Todo updated:", data);

    } catch (error) {
        console.log("Error while updating todo:", error);
    }
}

async function SaveTodo(todo_name){
    let query = `
        mutation InsertTenantUserRow($input: InsertTenantUserRow!) {
            InsertTenantUserRow(input: $input)
        }
    `;

    let variables = {
        input: {
            user_Id: tenant_id,
            tenant_user_uuid: user_uuid,
            rows: [
                {
                    table_Id: todo_table_id,
                    table_name: "todo",
                    data: {
                        "todo_name": todo_name,
                        
                    }
                }
            ]
        }
    };

    try {
        let res = await fetch(backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        let data = await res.json();

        if (!res.ok) {
            console.log("Failed to insert row");
            console.log(data);
            return;
        }

        console.log(data);
        console.log(data.data.InsertTenantUserRow)
        return data.data.InsertTenantUserRow

    } catch (error) {
        console.log("Error while inserting row");
        console.log(error);
    }
}


async function GetTodo() {
    const query = `
        mutation ReadTenantUserRow($input: ReadTenantUserRow!) {
            ReadTenantUserRow(input: $input) {
                id
                data
            }
        }
    `;

    const variables = {
        input: {
            user_Id: tenant_id,
            tenant_user_uuid: user_uuid,
            table_Id: todo_table_id,
            table_name: "todo",
        }
    };

    try {
        const res = await fetch(backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const result = await res.json();

        if (!res.ok) {
            console.log("Failed to read rows");
            console.log(result);
            return;
        }

        console.log(result);
        
        let todos=result.data.ReadTenantUserRow
        for (let todo of todos) {
            let id =todo.id
            let todo_name=todo.data.todo_name
            AppendToList(todo_name,id)
        }

    } catch (error) {
        console.log("Error while reading rows");
        console.log(error);
    }
}