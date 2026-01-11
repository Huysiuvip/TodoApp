import { AddTask } from "@/components/AddTask";
import { DateTimeFilter } from "@/components/DateTimeFilter";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StartsAndFilters } from "@/components/StartsAndFilters";
import { TaskListPagination } from "@/components/TaskListPagination";
import { TaskList } from "@/components/TaskList";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);


  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);
  useEffect(() => {
    setPage(1);
  }, [dateQuery,filter]);

  const handelNext = () =>{
    if(page < totalPages){
      setPage((prev) => prev+1)
    }
  }
  const handelPrev = () =>{
    if(page > 1){
      setPage((prev) => prev-1)
    }
  }
  const handelPageChange = (newPage) =>{
    setPage(newPage)
  }
  const fetchTasks = async () => {
    try {
      // const res= await fetch("http://localhost:5001/api/tasks");
      // const data = await res.json();
      // setTaskBuffer(data);
      // console.log(data)
      const res = await api.get(`tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };
  // bien
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });
  const handelTaskChange = () => {
    fetchTasks();
  };

  const visibleTasks = filteredTasks.slice(
   ( page -1) * visibleTaskLimit, page * visibleTaskLimit
  );
  if(visibleTasks.length ===0){
    handelPrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit)
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Teal Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
      `,
          backgroundSize: "100% 100%",
        }}
      />
      {/* Your Content/Components */}

      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* {Đầu trang} */}
          <Header />

          {/* {Tạo nhiệm vụ} */}
          <AddTask handleNewTaskAdded={handelTaskChange} />

          {/* {Thống kê và bộ lọc} */}

          <StartsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completeTaskCount}
          />

          {/* {Danh sách nhiệm vụ} */}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handelTaskChange}
          />

          {/* {Phân trang và lọc theo date*/}

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination 
            handelPageChange ={handelPageChange}
            handelNext ={handelNext}
            handelPrev={handelPrev}
            page ={page}
            totalPages = {totalPages}

            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          {/* Chan trang */}
          <Footer
            activeTaskCount={activeTaskCount}
            completedTaskCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
