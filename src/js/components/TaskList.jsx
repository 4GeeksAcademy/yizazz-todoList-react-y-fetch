import react, { useEffect, useState } from "react";

const URL_BASE_TODO = "https://playground.4geeks.com/todo";
const URL_BASE_TODOS = "https://playground.4geeks.com/todo/todos"


const TaskList = () => {
    const [newTask, setNewTask] = useState('');
    const [holdTask, setHoldTask] = useState([]);
    const [error, setError] = useState("");

    const getAllTask = async () => {
        try {
            const response = await fetch(`${URL_BASE_TODO}/users/Jesus`);
            const data = await response.json();
            if (response.ok) {
                setHoldTask(data.todos);
            } else if (response.status === 404) {
                createUser();
            }
        } catch (error) { }
    };

    const createUser = async () => {
        try {
            const response = await fetch(`${URL_BASE_TODO}/users/Jesus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                getAllTask();
            }
        } catch (error) { }
    };

    const validateTask = async () => {
        if (newTask.trim() === '') {
            setError("¡No puedes crear una tarea vacía!");
            return;
        }
        setError("");

        try {
            const response = await fetch(`${URL_BASE_TODO}/todos/Jesus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: newTask,
                    is_done: false
                })
            });

            if (response.ok) {
                setNewTask('');
                await getAllTask();
            }
        } catch (error) { }
    };

    const deleteTask = async (idToDelete) => {
        try {
            const response = await fetch(`${URL_BASE_TODOS}/${idToDelete}`, {
                method: "DELETE"
            });
            if (response.ok) {
                await getAllTask();
            }
        } catch (error) { }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const init = async () => {
            await getAllTask();
        };
        init();
    }, []);


    const handleDeleteAll = async () => {

        const confirm = window.confirm("Estás por borrar tus tareas, ¿Estás seguro?")
        if (!confirm) return;
        try {
            const response = await fetch(`${URL_BASE_TODO}/users/Jesus`, {
                method: "DELETE"
            });
            await getAllTask();

        } catch (error) {

        }
    }

    return (
        <div className="row d-flex justify-content-center">
            <div className="col-5 col-md-3 titulo d-flex justify-content-center">
                todos
            </div>
            <div className="row justify-content-center">
                <div className="general col-8 border p-0">
                    <input
                        className="w-100"
                        id="bar"
                        type="text"
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") validateTask();
                        }}
                        placeholder="Escribe tu tarea aquí!"
                    />
                    {error && (
                        <div className="alert alert-warning m-2 p-2" role="alert">
                            {error}
                        </div>
                    )}
                    <div>
                        {holdTask.map((task) => (
                            <div
                                className="task-item"
                                key={task.id}
                                onClick={() => deleteTask(task.id)}
                            >
                                <span className="task-text">{task.label}</span>
                                <span className="task-delete">X</span>
                            </div>
                        ))}
                    </div>
                    {holdTask.length > 0 && (
                        <span className="items-left">{holdTask.length} Items left.</span>
                    )}
                </div>
                <div className="container row">
                    <div className="col-12 d-flex justify-content-center">
                        <button
                            className="btn btn-danger mt-3 "
                            onClick={handleDeleteAll}
                        >
                            Borrar todas las tareas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { TaskList };
