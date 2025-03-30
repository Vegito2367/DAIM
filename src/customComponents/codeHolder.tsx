import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { codeHolderProps } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Copy, X, Sun, Moon, Download } from 'lucide-react';
import {motion} from "motion/react"

export default function CodeHolder({ code, handleSheetClose,handleGeminiClose}: codeHolderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'code-snippet.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className='flex flex-row items-center bg-accent w-full h-screen overflow-y-scroll bg-opacity-40 z-50 '>
    
      <div className="h-4/5 w-full dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <Button onClick={handleGeminiClose} className="z-50 w-1/2 ml-16 mb-6 bg-white shadow-md shadow-blue-400 hover:shadow-blue-600 hover:bg-white text-black hover:shadow-lg">Toggle Gemini</Button>
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h3 className="font-medium text-gray-700 dark:text-gray-200">Code Snippet</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy size={18} />
              {isCopied && <span className="absolute -bottom-8 right-0 text-xs bg-black text-white px-2 py-1 rounded">Copied!</span>}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadCode}
              title="Download code"
            >
              <Download size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSheetClose}
              title="Close"
              className="hover:bg-red-100 dark:hover:bg-red-900"
            >
              <X size={18} className="text-red-500" />
            </Button>
          </div>
        </div>
        
        {/* Code content */}
        <div className="flex-1 overflow-auto p-1">
          <SyntaxHighlighter 
            language="javascript" 
            style={isDarkMode ? atomOneDark : atomOneLight}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              height: '100%'
            }}
            showLineNumbers={true}
            wrapLongLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        
        {/* Footer with line count */}
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t">
          {code.split('\n').length} lines of code
        </div>
      </div>
    </motion.div>
  );
}