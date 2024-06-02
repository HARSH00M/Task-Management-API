import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import Task from './models/task';
import Tasks from './TempDB/tasks';
import { body, Result, validationResult } from 'express-validator';
const app = express();



// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());



const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('completed').notEmpty().withMessage('Completed is required').isBoolean().withMessage('Completed must be boolean'),
];

app.get('/', (req: Request, res: Response) => {
    res.send({
        "message": "working fine",
    })
})
app.get('/get-tasks', (req: Request, res: Response) => {
    res.send({
        "tasks": Tasks,
    })

})
app.post('/create-task', taskValidationRules, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        const task: Task = {
            id: Tasks.length + 1,
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed
        }
        Tasks.push(task)
        res.status(200).send({
            "message": "Task Added",
        });
    } catch (err) {
        res.status(500).send({
            "message": "error Occured",
        });
    }
})
app.get('/:id', (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    try {
        const isThereID = Tasks.find((task) => task.id === id);

        if (isThereID) {
            res.status(200).send(Tasks[id - 1]);
        } else {
            throw new Error();
        }

    } catch (e) {
        res.status(404).send({
            "message": "Unable to find the task"
        })
    }
})
app.put('/:id', taskValidationRules, (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const isThereID: any = Tasks.find((task) => task.id === id);




        if (isThereID as boolean) {
            Tasks[id - 1] = {
                id: id,
                title: req.body.title,
                description: req.body.description,
                completed: true
            }
            res.status(200).send({
                message: "Task updated",
            });
        } else {
            throw new Error("Unable to find the task");
        }
    } catch (error) {

        if (error instanceof Error) {
            res.status(404).send({
                message: error.message,
            });
        } else {
            res.status(500).send({
                message: "An unknown error occurred",
            });
        }
    }
})
app.delete('/:id', (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const index: number = Tasks.findIndex((task) => task.id === id);

        console.log(index)
        if (index >= 0) {

            Tasks.splice(index, 1);

            res.status(200).send({
                message: `Task delete with the id ${id}`
            })
        } else {
            throw new Error("Tasks not found");
        }
    } catch (error) {
        res.status(400).send({
            message: (error as Error).message,
        })
    }
})

app.listen(3000, () => {
    console.log("working ....")
})