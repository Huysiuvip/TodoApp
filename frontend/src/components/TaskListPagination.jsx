import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export const TaskListPagination = ({
  handelPageChange,
  handelNext,
  handelPrev,
  page,
  totalPages,
}) => {
  const generatePages = () =>{
    const pages = [];
    if(totalPages < 4){
      for(let i = 1; i < totalPages; i++){
        pages.push(i)
      }
    }else{
      if(page < 2){
        pages.push(1,2, 3, "...", totalPages);
      }else if(page >= totalPages-1){
        pages.push(1,"...", totalPages-2, totalPages-1, totalPages)
      }else{
        pages.push(1,"...",page,'...',totalPages)
      }
    }
    return pages
  }
  const pagesToShow = generatePages();
  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          {/* di ve trang truoc */}
          <PaginationItem>
            <PaginationPrevious
              onClick={page === 1 ? undefined : handelPrev}
              className={cn(
                "cursor-pointer",
                page === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {pagesToShow.map((p, index) => (
            <PaginationItem key={index}>{ p === '...' ? 
              (<PaginationEllipsis/>):
               (<PaginationLink className='cursor-pointer' isActive={p=== page} onClick={() =>{if(p!==page) handelPageChange(p)}}>
                {p}
               </PaginationLink> )
            }
            </PaginationItem>
          )) }

          {/* di ve trang sau */}
          <PaginationItem>
            <PaginationNext
              onClick={page === totalPages ? undefined : handelNext}
              className={cn(
                "cursor-pointer",
                page === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
