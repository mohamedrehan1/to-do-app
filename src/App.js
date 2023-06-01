import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
} from "@mui/material";
import { AddCircle, Delete, Edit, Archive, Done } from "@mui/icons-material";
import "./App.scss";

function App() {
  const [todos, setTodos] = useState([]);
  const [archivedTodos, setArchivedTodos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const openDialog = (todo, index) => {
    setCurrentTodo(todo.title);
    setEditIndex(index);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setCurrentTodo("");
    setEditIndex(null);
    setDialogOpen(false);
  };

  const handleInputChange = (event) => {
    setCurrentTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (currentTodo.trim() !== "") {
      if (editIndex !== null) {
        // Editing existing todo
        const updatedTodos = [...todos];
        updatedTodos[editIndex].title = currentTodo;
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        // Adding new todo
        const newTodo = {
          title: currentTodo,
          description: "",
          checked: false,
          createdAt: new Date().toISOString(),
        };
        setTodos([...todos, newTodo]);
      }
      setCurrentTodo("");
      setDialogOpen(false);
    }
  };

  const handleDeleteTodo = (index) => {
    const deletedTodo = todos[index];
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    setArchivedTodos([...archivedTodos, deletedTodo]);
  };

  const handleArchiveTodo = (index) => {
    const archivedTodo = todos[index];
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    setArchivedTodos([...archivedTodos, archivedTodo]);
  };

  const handleFinishTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].checked = true;
    updatedTodos[index].finishedAt = new Date().toISOString();
    setTodos(updatedTodos);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);

  return (
    <div className="container">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <div className="head">
            <Typography variant="h4" gutterBottom>
              To-Do List
            </Typography>
            <div className="toggle">
              <Typography variant="body2" gutterBottom></Typography>
              <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                color="primary"
              />
            </div>
          </div>
          <div className="list">
            <List>
              {todos.map((todo, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => openDialog(todo, index)}
                >
                  <ListItemText
                    primary={todo.title}
                    secondary={`Created At: ${todo.createdAt}`}
                  />
                  <ListItemSecondaryAction>
                    {!todo.checked && (
                      <IconButton
                        edge="end"
                        onClick={() => handleFinishTodo(index)}
                      >
                        <Done />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteTodo(index)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => openDialog(todo, index)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleArchiveTodo(index)}
                    >
                      <Archive />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
          <Typography variant="h6" gutterBottom>
            Archived To-Do Items:
          </Typography>
          <List>
            {archivedTodos.map((todo, index) => (
              <ListItem button key={index}>
                <ListItemText
                  primary={todo.title}
                  secondary={`Created At: ${todo.createdAt}, Finished At: ${
                    todo.finishedAt
                      ? new Date(todo.finishedAt).toLocaleString()
                      : ""
                  }`}
                />
              </ListItem>
            ))}
          </List>
          <IconButton color="primary" onClick={() => openDialog("", null)}>
            <AddCircle />
          </IconButton>
          <Dialog open={dialogOpen} onClose={closeDialog}>
            <DialogTitle>
              {editIndex !== null ? "Edit ToDo" : "Add ToDo"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the title for the ToDo.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="todo-title"
                label="Title"
                type="text"
                fullWidth
                value={currentTodo}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddTodo} color="primary">
                {editIndex !== null ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
