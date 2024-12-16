// src/components/wallet/ProtocolManager.tsx
import { useToast } from "@/ui/providers/toast";
import { Protocol, WalletContext } from "@/ui/state/WalletContext";
import { useContext, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ProtocolManager = () => {
    const { protocols, selectedProtocol, selectedNetwork, selectProtocol, selectNetwork, addProtocol } = useContext(WalletContext);
    const [protocolUrl, setProtocolUrl] = useState("");
    const { createToast } = useToast();

    const handleProtocolChange = (value: string) => {
        const protocol = protocols.find((p) => p.name === value);
        if (protocol) {
            selectProtocol(protocol);
        }
    };

    const handleNetworkChange = (value: string) => {
        if (!selectedProtocol) return;
        const network = selectedProtocol.networks.find((n) => n.networkId === value);
        if (network) {
            selectNetwork(network);
        }
    };

    const handleImportProtocol = async () => {
        if (!protocolUrl) {
            createToast("Please enter a valid protocol URL.", "warning");
            return;
        }

        try {
            // Validate URL format
            const url = new URL(protocolUrl);
            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Protocol URL must start with http:// or https://");
            }

            // Fetch protocol JSON
            const response = await fetch(protocolUrl);
            if (!response.ok) throw new Error(`Failed to fetch protocol data. Status: ${response.status}`);

            const protocol = (await response.json()) as Protocol;

            // Validate protocol structure
            const requiredFields = ["name", "logo", "bip44", "scriptUrl", "networks"];
            const isValid = requiredFields.every((field) => field in protocol);
            if (!isValid) throw new Error("Invalid protocol format. Missing required fields.");
            if (!Array.isArray(protocol.networks) || protocol.networks.length === 0) {
                throw new Error("Protocol must contain at least one network.");
            }

            // Check for duplicate protocol
            if (protocols.some((p) => p.name === protocol.name)) {
                throw new Error(`Protocol "${protocol.name}" already exists.`);
            }

            // Optionally, verify the script URL
            const scriptResponse = await fetch(protocol.scriptUrl);
            if (!scriptResponse.ok) throw new Error("Script URL is not accessible.");

            // Add protocol to context and persist to localStorage
            addProtocol(protocol);
            const updatedProtocols = [...protocols, protocol];
            localStorage.setItem("protocols", JSON.stringify(updatedProtocols));

            createToast(`Protocol "${protocol.name}" imported successfully!`, "success");
            setProtocolUrl("");
        } catch (error) {
            console.error("ImportProtocol Error:", error);
            createToast(`Failed to import protocol: ${(error as Error).message}`, "error");
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="px-2 pb-2 pt-4">
                    <CardTitle>Protocol Manager</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent className="p-2">
                    <div className="flex flex-col gap-4">
                        {protocols.length > 0 ? (
                            <div className="flex flex-row w-full gap-2">
                                <Select value={selectedProtocol?.name || ""} onValueChange={(value) => handleProtocolChange(value)}>
                                    <SelectTrigger className="w-1/2">
                                        <SelectValue placeholder="Select a protocol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {protocols.map((protocol) => (
                                            <SelectItem key={protocol.name} value={protocol.name}>
                                                <div className="flex items-center space-x-2">
                                                    <img src={protocol.logo} alt={`${protocol.name} logo`} className="w-6 h-6 rounded-full" />
                                                    <span>{protocol.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedProtocol && (
                                    <Select value={selectedNetwork?.networkId || ""} onValueChange={(value) => handleNetworkChange(value)}>
                                        <SelectTrigger className="w-1/2">
                                            <SelectValue placeholder="Select a network" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedProtocol.networks.map((net) => (
                                                <SelectItem key={net.networkId} value={net.networkId}>
                                                    {net.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        ) : null}
                        <div className="flex flex-col w-full gap-2">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="importProtocol">Import New Protocol</Label>
                                <Input
                                    id="importProtocol"
                                    type="text"
                                    value={protocolUrl}
                                    onChange={(e) => setProtocolUrl(e.target.value)}
                                    placeholder="Enter protocol JSON URL"
                                />
                            </div>
                            {/* <button onClick={handleImportProtocol}>Import Protocol</button> */}
                            <Button variant={"secondary"} onClick={handleImportProtocol}>
                                Import Protocol
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ProtocolManager;
