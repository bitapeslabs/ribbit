// src/components/AccountManager.tsx
import { WalletContext } from "@/ui/state/WalletContext";
import { useContext } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AccountManager = () => {
    const { accounts, selectedAccount, selectAccount, addAccount } = useContext(WalletContext);

    const handleChange = (value: string) => {
        const account = accounts.find((a) => a.name === value);
        if (account) {
            selectAccount(account);
        }
    };

    return (
        <div>
            <Card>
                <CardContent className="px-2 py-2 text-center flex flex-row gap-2">
                        <Select value={selectedAccount?.name || ""} onValueChange={(value) => handleChange(value)}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select a protocol" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map((account) => (
                                    <SelectItem key={account.name} value={account.name}>
                                        <div className="flex items-center space-x-2">
                                            {/* <img src={protocol.logo} alt={`${protocol.name} logo`} className="w-6 h-6 rounded-full" /> */}
                                            <span>{account.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant={"secondary"} onClick={addAccount}>
                            Add Account
                        </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountManager;
