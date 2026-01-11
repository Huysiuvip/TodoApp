import Task from "../models/Task.js";

//=================
export const getAllTasks = async (req, res) => {
  const {filter = 'today'} = req.query;
  const now = new Date();
  let startDate;
  switch (filter){
    case "today":
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    break;
    case "week":
    const mondayDate = now.getDate() -(now.getDate()-1) - (now.getDate() === 0 ? 7 :0)
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    break;
    case "month":
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    break;
    case "all":
    startDate = null;
  }
  const query = startDate ? {createdAt:{$gte:startDate}}:{};


  try {
    // const tasks = (await Task.find().sort({createdAt:-1}));
    // const activeCount = await Task.countDocuments({status:"active"})
    // const completeCount = await Task.countDocuments({status:"complete"})// chay 3 query se gay cham
    // cach 2 chay cung luc
    const result = await Task.aggregate([
      {$match:query},
      {
       $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [{ $match: { status: "complete" } }, { $count: "count" }],
        },
      }
    ])  

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount});
  } catch (error) {
    console.error("Lỗi hệ thống", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
//======================
export const createTasks = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
   return res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi goi CreateTask", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
//=======================
export const updateTasks = async (req, res) => {
  try {
    const { title, status, completeAt } = req.body;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completeAt,
      },
      { new: true }
    );
    if (!updateTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(updateTask)
  } catch (error) {
    console.error("Lỗi khi goi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }

};

//=======================
export const deleteTasks = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id)
    if (!deleteTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(deleteTask)
  } catch (error) {
    console.error("Lỗi khi goi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
}
