"use client";
import ListingHolder from "@/customComponents/listingHolder";
import React, { FormEvent, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button";
import { useDisconnect } from "wagmi";
import Navbar from "@/customComponents/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [message] = useState("Sign this message to authenticate");
    const { disconnect } = useDisconnect();

    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [cid, setCID] = useState("");
    const [formDetails, setFormDetails] = useState({ title: "", description: "", tags: "", metrics: "" });

    const [showForm, setShowForm] = useState(true);

    const user = {
        name: "John Doe",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        listings: [
            {
                title: "Test Title",
                description: "Test Description",
                category: ["Category1", "Category2"],
                metrics: [
                    { property: "Metric1", value: "Value1" },
                    { property: "Metric2", value: "Value2" },
                ],
                cid: "Qm...",
            },
            {
                title: "Another Title",
                description: "Another Description",
                category: ["Category3"],
                metrics: [
                    { property: "Metric3", value: "Value3" },
                    { property: "Metric4", value: "Value4" },
                ],
                cid: "Qm...",
            },
        ],
    };


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
                if(!data.success) {
                    alert("Authentication failed.");
                    console.log(data.status)
                    return;
                }
              } catch (error) {
                console.error("Signing error:", error);
              }
            console.log("Proof ended")
            console.log("Uploading file...");
            console.log("File name:", file.name);
            setUploading(true);
            const data = new FormData();
            data.set("file", file);
            data.set("title", formDetails.title);
            data.set("description", formDetails.description);
            data.set("tags", formDetails.tags);
            data.set("metrics", formDetails.metrics);
            if(address) {
                data.set("address", address);
            }
            else{
                alert("No address found");
                return;
            }

            const uploadRequest = await fetch("/api/file", {
                method: "POST",
                body: data,
            });
            const responseData = await uploadRequest.json();
            console.log("Upload response:", responseData);
            if(responseData.status === 403) {
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
    return (
        <>
            <Navbar />
            <div className="flex flex-row items-center justify-between bg-gray-100 p-4">
                <h1 className="text-2xl font-semibold">Profile</h1>
                <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                    Disconnect
                </Button>
            </div>
            {/* Profile Header */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <p className="text-gray-600 text-sm">Wallet Address:</p>
                <p className="text-gray-800 font-mono break-all bg-gray-100 p-2 rounded-md text-sm">
                    {address}
                </p>
            </div>


            <div className="flex flex-row justify-center gap-10 items-center mb-4">
                <Button onClick={() => { setShowForm(true) }} className="bg-blue-600">New Listing</Button>
                <Button onClick={() => { setShowForm(false) }} className="bg-blue-600">Current Listings</Button>
            </div>
            <hr></hr>
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-lg m-4">
                    <h2 className="text-xl font-semibold mb-4">Upload Listing</h2>
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={formDetails.title}
                            onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={formDetails.description}
                            onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={formDetails.tags}
                            onChange={(e) => setFormDetails({ ...formDetails, tags: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Metrics (property:value comma separated)"
                            value={formDetails.metrics}
                            onChange={(e) => setFormDetails({ ...formDetails, metrics: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="my-4">
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors group cursor-pointer">
                                <div className="space-y-1 text-center">

                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            {!file && (
                                                <>
                                                <span>Upload a file</span>
                                                <p className="pl-1">or drag and drop</p>
                                                </>
                                            )}
                                            {file && (
                                                <span>{file.name} uploaded</span>
                                            )}
                                            <input id="file-upload" name="file-upload" onChange={handleChange} type="file" className="sr-only" />
                                        </label>
                                        
                                    </div>
                                    <p className="text-xs text-gray-500">put in your source code as a zip file.</p>
                                </div>
                            </div>
                        </div>
                        <Button onClick={uploadFile} type="button" disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    </form>
                </div>
            )}
            {!showForm && (
                <div className="p-10 mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Current Listings</h2>
                    <div className="space-y-4 flex flex-row justify-center gap-5 flex-wrap">
                        {user.listings.length > 0 ? (
                            user.listings.map((listing, index) => (
                                <ListingHolder
                                    title={listing.title}
                                    description={listing.description}
                                    category={listing.category}
                                    metrics={listing.metrics}
                                    cid={listing.cid}
                                    handleCode={(cid) => console.log("CID from child:", cid)}
                                    key={index}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No active listings.</p>
                        )}
                    </div>
                </div>
            )}

        </>
    );
}
