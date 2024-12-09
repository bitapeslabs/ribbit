// src/components/SendReceiveTabs.tsx
import React from "react";
import SendToken from "./SendToken";
import ReceiveToken from "./ReceiveToken";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const SendReceiveTabs: React.FC = () => {
    return (
        <Card>
            <CardContent className="p-2">
                <Tabs defaultValue="send" className="w-full min-h-[240px]">
                    <TabsList className="w-full bg-secondary">
                        <TabsTrigger value="send" className="w-full">
                            Send
                        </TabsTrigger>
                        <TabsTrigger value="receive" className="w-full">
                            Receive
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="send">
                        <SendToken />
                    </TabsContent>
                    <TabsContent value="receive">
                        <ReceiveToken />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default SendReceiveTabs;
