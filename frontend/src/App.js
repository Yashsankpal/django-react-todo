import React, { Component, Fragment, useEffect, useState } from "react";
import Modal from "./components/Modal";
import axios from "axios";

const App = () => {
  
  const [modal, setmodal] = useState(false)
  const [ viewCompleted , setviewCompleted ] = useState(false)
  const [activeItem, setactiveItem] = useState({
    title: "",
    description: "",
    completed: false
  })
  const [todoList, settodoList] = useState([])
  
  
  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setactiveItem(item)
    setmodal(!modal)
  };
  
  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const displayCompleted = status => {
    if (status) {
      setviewCompleted(status)
    }else{
      setviewCompleted(status)
    }
  };

  const handleDelete = item => {
    axios
    .delete(`http://localhost:8000/api/todos/${item.id}`)
    .then(res => refreshList());
  };
  const editItem = item => {
    setactiveItem(item)
    setmodal(!modal)
  };

  const renderItems = () => {
    const newItems = todoList.filter(
      item => item.completed === viewCompleted
      );
      return newItems.map(item => (
        <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
        >
        <span
          className={`todo-title mr-2 ${
            viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
          >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary mr-2"
            >
            {" "}
            Edit{" "}
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="btn btn-danger"
            >
            Delete{" "}
          </button>
        </span>
      </li>
    ));
  };

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then(res => settodoList(res.data))
      .catch(err => console.log(err));
  };
  

  const toggle = () => {
    setmodal(!modal)
  };
  
  const handleSubmit = item => {
    toggle();
    if (item.id) {
      axios
      .put(`http://localhost:8000/api/todos/${item.id}/`, item)
      .then(res => refreshList());
      return;
    }
    axios
    .post("http://localhost:8000/api/todos/", item)
    .then(res => refreshList());
  };

  useEffect(() => {
    refreshList()
    return () => {
      settodoList([])
    }
  }, [])
  return (
    <Fragment>
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={createItem} className="btn btn-primary">
                  Add task
                </button>
              </div>
              {renderTabList()}
              <ul className="list-group list-group-flush">
                {renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {modal ? (
          <Modal
            activeItem={activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        ) : null}
      </main>
    </Fragment>
  )
}

export default App
