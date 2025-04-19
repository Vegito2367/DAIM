import React from 'react';
import CodeHolder from '@/customComponents/codeHolder'; // Adjust import path as needed

'use client';
export interface codeHolderProps {
    code: string;
    handleSheetClose: () => void;
    handleGeminiClose: () => void;
}

export interface CodeShowProps extends codeHolderProps {
    title: string;
}


export default function Page(props: CodeShowProps ) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">{props.title}</h1>
            
            <CodeHolder
              code={props.code!}
              handleSheetClose={props.handleSheetClose}
              handleGeminiClose={props.handleGeminiClose}
            />
      </div>
    );
}