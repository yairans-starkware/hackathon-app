import { Download } from "lucide-react"
import { Button } from "../ui/button"
import { TabsContent } from "../ui/tabs"
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const ManagementTab = () => {
  return (
    <TabsContent value="management" className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Eligible Wallets</h2>
        <Button onClick={handleExportStats}>
          <Download className="mr-2 h-4 w-4" />
          Export Stats
        </Button>
      </div>
      <div className="space-y-4">
        {eligibleWallets.map((wallet) => (
          <div key={wallet.address} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <span className="font-semibold">{wallet.name}</span>
              <Badge variant="secondary" className="ml-2">{truncateAddress(wallet.address)}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteWallet(wallet.address)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete wallet</span>
            </Button>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Set New Wallet List</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder='{"Alice": "0x1234...5678", "Bob": "0xabcd...efgh"}'
            value={newWalletList}
            onChange={(e) => setNewWalletList(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetNewList}>Set New List</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}