import react, { useEffect, useState } from "react"


const URL_BASE_TODO = "https://playground.4geeks.com/todo"

const TaskList = () => {
    const [newTask, setNewTask] = useState('')
    const [holdTask, setHoldTask] = useState([])
    const [error, setError] = useState("");

    const validateTask = () => {
        if (newTask.trimStart() === '') {
            setError("¡No puedes crear una tarea vacía!")
            return;
        }
        setError("");
        const taskIdObject = {
            id: Date.now(),
            text: newTask,
        };
        setHoldTask([...holdTask, taskIdObject]);
        setNewTask('');
    };

    const getAllTask = async () => {
        try {
            const response = await fetch(`${URL_BASE_TODO}/users/Jesus`)
            console.log(response)
            const data = await response.json()
            if (response.ok) {
                setHoldTask(data.todos)
            } else if (response.status == 404){
                console.log("User no existe")
            }
            else{
                throw new Error("Error al crear usuario")
            }
        } catch (error) {

        }
    }


    const createUser = async () => {
        try {
            const response = await fetch(`${URL_BASE_TODO}/users/Jesus`, {
                method:"POST"
            })
        } catch (error) {
            
        }
    }



    const deleteTask = (idToDelete) => {
        setHoldTask(holdTask.filter((task) => task.id !== idToDelete))
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [error])

    useEffect(() => {
        getAllTask()
    }, [])


    return (
        <div className="row d-flex justify-content-center">
            <div className="col-5 col-md-3 titulo d-flex justify-content-center">todos
            </div>
            <div className="row justify-content-center">
                <div className="general col-8 border p-0">
                    <input className="w-100" id="bar"
                        type="text"
                        value={newTask}
                        onChange={event => setNewTask(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === "Enter") validateTask();
                        }}
                        placeholder="Escribe tu tarea aquí!"
                    ></input>
                    {error && (
                        <div className="alert alert-warning m-2 p-2" role="alert">{error}</div>
                    )}
                    <div>{holdTask.map((task) => (
                        <div className="task-item" key={task.id}
                            onClick={() => deleteTask(task.id)}>
                            <span className="task-text">{task.text}</span>
                            <span className="task-delete">
                                X
                            </span>
                        </div>
                    ))}
                    </div>
                    {holdTask.length > 0 && (
                        <span className="items-left">{holdTask.length} Items left.</span>
                    )}
                </div>
            </div>

        </div>
    );

};
export { TaskList };