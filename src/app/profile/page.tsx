"use client";
import ListingHolder from "@/customComponents/listingHolder";
import React, { FormEvent, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button";
import { useDisconnect } from "wagmi";
import Navbar from "@/customComponents/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { KPI, ListingProps } from "../page";
import { jsonData } from "../page";
import CodeHolder from "@/customComponents/codeHolder";
export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [message] = useState("Sign this message to authenticate");
    const { disconnect } = useDisconnect();
    const [myListings, setMyListings] = useState<ListingProps[]>([]);

    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [cid, setCID] = useState("");
    const [formDetails, setFormDetails] = useState({ title: "", description: "", tags: "", metrics: "" });

    const [showForm, setShowForm] = useState(true);

    const [showSheet, setshowSheet] = useState(false);
    const [code, setCode] = useState<string>();

    useEffect(() => {
        async function fetchMyListings() {
            if (!address) return;
            const response = await fetch("/api/listFileByCID", {
                method: "POST",
                body: JSON.stringify({ address }),
            });
            const data = await response.json();
            const jsonList = data.payload as jsonData[];
            console.log("Listings", jsonList);
            if (data.status === 200) {
                jsonList.map((list, index) => {
                    const categories: string[] = list.tags.split(",")
                    const metricPairs: string[] = list.metrics.split(",");
                    const metric: KPI[] = [];
                    metricPairs.map((met, index) => {
                        const pair = met.split(":")
                        metric.push({
                            property: pair[0],
                            value: pair[1]
                        })
                    })

                    setMyListings(prevHolder => [...prevHolder, {
                        title: list.title,
                        description: list.description,
                        category: categories,
                        metrics: metric,
                        cid: list.cid
                    }])
                })
            } else {
                console.error("Error fetching files:", data.error);
            }
        }
        fetchMyListings();
    }, [address])

    async function getCIDfromChild(cid: string) {
        console.log("CID from child:", cid);
        try {
            const response = await fetch(`/api/getCode?fetchCID=${cid}`)
            const data = await response.json();
            const payload: string = data.payload;
            setshowSheet(true)
            setCode(payload)

        }
        catch (e) {
            console.log(e)
        }
    }


    async function handleSignOut() {
        disconnect();
        alert("Disconnected successfully!");
    }

    const uploadFile = async () => {
        console.log(file?.name);

        try {
            if (!file) {
                alert("No file selected");
                return;
            }

            if (formDetails.title === "" || formDetails.description === "" || formDetails.tags === "" || formDetails.metrics === "") {
                alert("Please fill in all the details");
                return;
            }
            setUploading(true);
            console.log("Proof started")
            try {
                const signature = await signMessageAsync({ message });
                // Send signature and address to the backend for verification
                const response = await fetch("/api/authentication", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ address, message, signature }),
                });

                const data = await response.json();
                if (!data.success) {
                    alert("Authentication failed.");
                    console.log(data.status)
                    setUploading(false);
                    return;
                }
            } catch (error) {
                console.error("Signing error:", error);
            }
            console.log("Proof ended")
            console.log("Uploading file...");
            console.log("File name:", file.name);
            
            const data = new FormData();
            data.set("file", file);
            data.set("title", formDetails.title);
            data.set("description", formDetails.description);
            data.set("tags", formDetails.tags);
            data.set("metrics", formDetails.metrics);
            if (address) {
                data.set("address", address);
            }
            else {
                alert("No address found");
                return;
            }

            const uploadRequest = await fetch("/api/file", {
                method: "POST",
                body: data,
            });
            const responseData = await uploadRequest.json();
            console.log("Upload response:", responseData);
            if (responseData.status === 403) {
                alert("File already exists");
                setUploading(false);
                return;
            }
            setUploading(false);
            setFile(undefined);
            const resetObject = {
                title: "",
                description: "",
                tags: "",
                metrics: ""
            }
            setFormDetails(resetObject);
            alert("File uploaded successfully");
        } catch (e) {
            console.log(e);
            setUploading(false);
            alert("Trouble uploading file");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.item(0)!);
    };

    if (!isConnected || !address) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
                        <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
                        <p className="text-gray-600 mb-4">Please sign in to access your profile and listings.</p>
                        <ConnectButton />
                    </div>
                </div>
            </>
        );
    }
    function closeSheet() {
        setshowSheet(false)
    }
    return (
        <>
            <Navbar />
            {showSheet && (
                <div className="absolute w-4/5 h-2/5 bg-gray-200">
                    <CodeHolder code={code as string} handleSheetClose={closeSheet} handleGeminiClose={()=>{}} />
                </div>
            )}

            <div className="flex flex-col min-h-screen bg-gray-50">
                {/* Header with improved spacing and shadow */}
                <div className="flex flex-row items-center justify-between bg-white p-6 shadow-sm sticky top-0 z-10">
                    <h1 className="text-2xl font-medium text-gray-800">Profile</h1>
                    <Button onClick={handleSignOut} className="shadow-md shadow-blue-400 hover:shadow-blue-600 bg-white hover:bg-white text-black hover:shadow-lg px-4 py-2 rounded-md transition-all duration-200">
                        Disconnect
                    </Button>
                </div>

                <div className="max-w-4xl w-full mx-auto p-6">
                    {/* Profile Header with cleaner display */}
                    <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Wallet Address</p>
                        <p className="text-gray-800 font-mono break-all bg-gray-50 p-3 rounded-md text-sm border-l-4 border-blue-600">
                            {address}
                        </p>
                    </div>

                    {/* Tab buttons with improved design */}
                    <div className="flex flex-row justify-center gap-4 mb-8">
                        <Button
                            onClick={() => { setShowForm(true) }}
                            className={`px-6 py-2 rounded-md transition-all duration-200 ${showForm ? 'bg-blue-600 text-white' : 'bg-white shadow-md shadow-blue-400 hover:shadow-blue-600 hover:bg-white text-black hover:shadow-lg'}`}
                        >
                            New Listing
                        </Button>
                        <Button
                            onClick={() => { setShowForm(false) }}
                            className={`px-6 py-2 rounded-md transition-all duration-200 ${!showForm ? 'bg-blue-600 text-white' : 'bg-white shadow-md shadow-blue-400 hover:shadow-blue-600 hover:bg-white text-black hover:shadow-lg'}`}
                        >
                            Current Listings
                        </Button>
                    </div>

                    {/* New Listing Form with improved styling */}
                    {showForm && (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-medium mb-6 text-gray-800">Upload Listing</h2>
                            <form className="space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={formDetails.title}
                                        onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                                        className="border border-gray-200 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Description"
                                        value={formDetails.description}
                                        onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                                        className="border border-gray-200 p-3 rounded-md w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Tags (comma separated)"
                                        value={formDetails.tags}
                                        onChange={(e) => setFormDetails({ ...formDetails, tags: e.target.value })}
                                        className="border border-gray-200 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Metrics (property:value comma separated)"
                                        value={formDetails.metrics}
                                        onChange={(e) => setFormDetails({ ...formDetails, metrics: e.target.value })}
                                        className="border border-gray-200 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* File upload area with blue accent */}
                                <div className="my-6">
                                    <div className="flex justify-center px-6 py-8 border-2 border-gray-200 border-dashed rounded-md hover:border-blue-600 transition-colors group cursor-pointer bg-gray-50">
                                        <div className="space-y-2 text-center">
                                            <div className="flex flex-col text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none cursor-pointer">
                                                    {!file ? (
                                                        <div className="flex flex-col items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                            </svg>
                                                            <span>Upload a file</span>
                                                            <p className="text-gray-500">or drag and drop</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>{file.name} uploaded</span>
                                                        </div>
                                                    )}
                                                    <input id="file-upload" name="file-upload" onChange={handleChange} type="file" className="sr-only" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">Upload your source code as a zip file</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={uploadFile}
                                    type="button"
                                    disabled={uploading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md w-full transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </div>
                                    ) : "Upload Listing"}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Current Listings with card design */}
                    {!showForm && (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 overflow-x-scroll">
                            <h2 className="text-xl font-medium mb-6 text-gray-800">Current Listings</h2>
                            <div className="flex flex-row gap-6">
                                {true ? (
                                    myListings.map((list, index) => {
                                        return (
                                            <ListingHolder
                                                title={list.title}
                                                description={list.description}
                                                category={list.category}
                                                metrics={list.metrics}
                                                cid={list.cid}
                                                handleCode={getCIDfromChild}
                                                key={index}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No active listings</p>
                                        <p className="text-gray-400 text-sm mt-1">Create your first listing to get started</p>
                                        <Button
                                            onClick={() => { setShowForm(true) }}
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                        >
                                            Create Listing
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}
