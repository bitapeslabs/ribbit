import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BalanceDisplayProps {
    balance: number;
}

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

export default function BalanceDisplay({ balance }: BalanceDisplayProps) {
    const [usdRate, setUsdRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsdRate = async () => {
            try {
                const response = await fetch(COINGECKO_API_URL);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.bitcoin && data.bitcoin.usd) {
                    setUsdRate(data.bitcoin.usd);
                } else {
                    throw new Error("Invalid data format received.");
                }
            } catch (err: any) {
                setError(err.message || "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsdRate();
    }, []);

    const usdValue = usdRate !== null ? (balance * usdRate).toFixed(2) : "N/A";

    return (
        <Card>
            <CardContent className="px-4 py-6 text-center">
                <div className="text-3xl font-semibold tracking-tighter">{balance} BTC</div>
                {isLoading ? (
                    <div className="mt-1 text-sm font-medium text-gray-500">Loading USD value...</div>
                ) : error ? (
                    <div className="mt-1 text-sm font-medium text-red-500">Error: {error}</div>
                ) : (
                    <div className="mt-1 text-sm font-medium text-primary">${usdValue} USD</div>
                )}
            </CardContent>
        </Card>
    );
}
