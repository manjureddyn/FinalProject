import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Card, CardContent, CardHeader, Typography, Checkbox, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function TodoListPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    console.log(localStorage.getItem('token'));
    try {
      
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,

          
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        // console.log(response);
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.');
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    const token = localStorage.getItem('token');
    if (newTask.trim() !== '' && token && dueDate) {
      const newTaskObj = {
        text: newTask,
        category,
        completed: false,
        dueDate: new Date(dueDate).toISOString()
      };
      try {

        const response = await fetch('http://localhost:5001/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newTaskObj)
        });
        console.log(response);
        if (response.ok) {
          const addedTask = await response.json();
          setTasks([...tasks, addedTask]);
          setNewTask('');
          setDueDate('');
          toast.success('Task added successfully.');
        } else {
          throw new Error('Failed to add task');
        }
      } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task. Please try again.');
      }
    }
  };

  const toggleTaskCompletion = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const taskToUpdate = tasks.find(t => t._id === id);
        if (!taskToUpdate) return;

        const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ completed: !taskToUpdate.completed })
        });
        if (response.ok) {
          setTasks(tasks.map(task => 
            task._id === id ? { ...task, completed: !task.completed } : task
          ));
          toast.success('Task updated successfully.');
        } else {
          throw new Error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task. Please try again.');
      }
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setTasks(tasks.filter(task => task._id !== id));
          toast.success('Task deleted successfully.');
        } else {
          throw new Error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again.');
      }
    }
  };

  const upcomingTasks = tasks
    .filter(task => !task.completed && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader title="Your Tasks" />
      <CardContent>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <TextField
            label="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <FormControl style={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" color="primary" onClick={addTask}>Add</Button>
        </div>

        <Typography variant="h6" gutterBottom>Upcoming Tasks</Typography>
        <List>
          {upcomingTasks.map(task => (
            <ListItem key={task._id} dense button onClick={() => toggleTaskCompletion(task._id)}>
              <Checkbox checked={task.completed} />
              <ListItemText 
                primary={task.text}
                secondary={`${task.category} - Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>All Tasks</Typography>
        <List>
          {tasks.map(task => (
            <ListItem key={task._id} dense button onClick={() => toggleTaskCompletion(task._id)}>
              <Checkbox checked={task.completed} />
              <ListItemText 
                primary={task.text}
                secondary={`${task.category} - Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}