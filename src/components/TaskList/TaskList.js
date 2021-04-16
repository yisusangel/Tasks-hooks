import React, { useState, useEffect } from 'react';
import {Link} from'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTaskList, deleteTask } from '../../actions/taskActions';
import Pager from '../Pager/Pager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TaskList.css';

const TaskList = (props) => {
    const [filter, setFilter] = useState({
        find: '',
        page: 1,
        pagesTotal: 0
    })

    const taskList = useSelector(state => state.taskList);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTaskList(filter));
    }, []);

    const changeFilter = (val, type) => {
        const newFilter = filter;
        newFilter[type] = val;
        setFilter(newFilter);
        dispatch(getTaskList(filter));
    };

    const deleteTaskById = (id) => {
        var r = window.confirm("Esta seguro que desea borrar la tarea?");
        if (r) {
            dispatch(deleteTask(id));
        }
    }

    const dateString = (date) => {
        return new Date(date).toLocaleString('es-CL');
    }
    
    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h5>Lista de Tareas</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-5">
                            <div className="form-group">
                                <input
                                    placeholder="Buscar Por Descripción"
                                    className="form-control"
                                    id="taskFilter"
                                    onKeyUp={(e) => changeFilter(e.target.value, 'find')}
                                />
                            </div>

                        </div>
                        <div className="col-2">
                            <button className="btn btn-secondary" onClick={() => changeFilter(1, 'page')}>Buscar</button>
                        </div>
                        <div className="col-5 text-right">
                            <Link to={`/updateTask`} className="btn btn-primary">Nueva Tarea</Link>
                        </div>
                    </div>
                    <div className="table-cont">
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                    <th>Descripción</th>
                                    <th>Fecha de Creación</th>
                                    <th>Vigencia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            {taskList.list && taskList.list.map((key, i) => (
                                <tr key={i}>
                                    <td>{key.description}</td>
                                    <td>{dateString(key.creationDate)}</td>
                                    <td>
                                        {key.active &&
                                            <span className="badge badge-success">Vigente</span>
                                        }{!key.active &&
                                            <span className="badge badge-danger">Inactivo</span>
                                        }
                                    </td>
                                    <td>
                                        <Link to={`/updateTask/${key.id}`}><FontAwesomeIcon icon="pencil-alt"/></Link>
                                        <span aria-hidden="true" className="delete-button ml-4" onClick={() => deleteTaskById(key.id)}><FontAwesomeIcon icon="trash-alt"/></span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pager"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Numero de páginas"
                    >
                        <Pager 
                            currentPage={filter.page}
                            totalPages={Math.ceil(taskList.count/10)}
                            updatePage={(page) => {changeFilter(page, 'page')}}>
                        </Pager>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskList;