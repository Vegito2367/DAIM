import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingComponentProps } from "@/app/page";
import { Code, ThumbsUp, ThumbsDown } from "lucide-react";
import {motion} from "motion/react"

export default function ListingHolder(listingDetails: ListingComponentProps) {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-row items-center justify-center max-w-[500px]"
    >
<Card className="overflow-hidden transition-all p-6 duration-300 hover:shadow-xl border max-h-fit border-gray-200 dark:border-gray-800 min-w-[400px] flex flex-col">
      {/* Card Header */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold line-clamp-2">{listingDetails.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {listingDetails.category.map((cat, index) => (
            <span 
              key={index} 
              className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <CardDescription className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {listingDetails.description}
        </CardDescription>
        
        <div className="flex flex-row gap-2">
          {listingDetails.metrics.map((met, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">{met.property}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{met.value}</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex w-full gap-2">
          <Button 
            onClick={() => listingDetails.handleCode(listingDetails.cid, listingDetails.title)} 
            className="bg-blue-600 hover:bg-blue-700 flex-1 flex items-center justify-center gap-1"
          >
            <Code size={16} /> Code
          </Button>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 dark:hover:text-green-400 border-green-200 dark:border-green-800"
            >
              <ThumbsUp size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:text-red-400 border-red-200 dark:border-red-800"
            >
              <ThumbsDown size={16} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
    </motion.div>
    
  );
}