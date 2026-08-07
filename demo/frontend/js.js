let username=window.prompt("Enter your name")
let email=window.prompt("Enter email")
let pass=window.prompt("Enter Password")
let tenant_id="97a56a18-8585-4efd-9bbf-b78d6dea7ab8"
let backend_url="http://localhost:8080/query"
let user_uuid
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

function Addtodo(){
    let input=document.getElementById("input")
    let todo_name=input.value
    
    let id=SaveTodo(todo_name)

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
    delete_button.addEventListener("click",(e)=>{
        DeleteTodo(id)
        li_item.remove();
    })

    li_item.appendChild(delete_button)
}

function DeleteTodo(row_id){

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
        updateButton.addEventListener("click", () => {
            let newValue = input.value;

            if (newValue.trim() === "") {
                return;
            }

            item.firstChild.textContent = newValue;

            modal.remove();

            
            UpdateTodo(id, newValue);

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

function UpdateTodo(row_id,todo_name){

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
                    table_Id: "e33b1752-6337-4f40-81da-6e719f02ba3c",
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
            table_Id: "e33b1752-6337-4f40-81da-6e719f02ba3c",
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