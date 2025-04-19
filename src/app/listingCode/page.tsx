'use client';
import React from 'react';
import CodeHolder from '@/customComponents/codeHolder'; // Adjust import path as needed
import AIChatbox from '@/customComponents/chatbox';
import Navbar from '@/customComponents/navbar';
import { Button } from '@/components/ui/button';


export interface CodeShowProps {
    title: string;
    code: string;
    handleSheetClose: () => void;
}



export default function CodeListing(props: CodeShowProps ) {
    return (
        <div className="flex flex-col justify-center mx-auto px-2">
          <Navbar />
            <div className="flex flex-row justify-between items-center bg-white p-4 rounded-lg mb-4">
            <h1 className="text-2xl font-bold text-center mb-4">{props.title}</h1>
            <Button onClick={props.handleSheetClose} className="bg-blue-600 text-white px-4 py-2 rounded">
                Close
            </Button>
            </div>
            
            <div className='flex flex-row w-full h-full'>
            <CodeHolder
              code={props.code!}
            handleSheetClose={props.handleSheetClose}
            />
            <AIChatbox currentCode={props.code!} className='overflow-y-scroll'/>
            </div>
            
      </div>
    );
}