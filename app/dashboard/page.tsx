"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { cn } from "@/lib/utils"
import axios from "axios"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [lalinData, setLalinData] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLalinData = async (current_page = 0, combineData = []) => {
      setIsLoading(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const response = await axios.get(`http://localhost:8080/api/lalins?page=&limit=10000&tanggal=${formattedDate}`)
        const data = await response.data
        setLalinData(data)

      } catch (error) {
        console.error("Error fetching data:", error) 
      } finally {
        setIsLoading(false)
      }
    }
    fetchLalinData()
  }, [date])


  const gerbangResult = lalinData !== undefined && lalinData?.data?.rows?.rows?.reduce((acc: { [key: string]: number }, curr: { IdGerbang: string }) => 
    {
    const key = curr.IdGerbang
    if (!acc.hasOwnProperty(key)) {
      acc[key] = 0
    }
    acc[key] += 1
    return acc
  }, {})

  const gerbangOutput = []
  for (const key in gerbangResult) {
    if (gerbangResult.hasOwnProperty(key)) {
      gerbangOutput.push(gerbangResult[key]);
    }
  }

  const shiftResult = lalinData !== undefined && lalinData?.data?.rows?.rows?.reduce((acc: { [key: string]: number }, curr: { Shift: string }) => 
    {
    const key = curr.Shift
    if (!acc.hasOwnProperty(key)) {
      acc[key] = 0
    }
    acc[key] += 1
    return acc
  }, {})

  const shiftOutput = []
  for (const key in shiftResult) {
    if (shiftResult.hasOwnProperty(key)) {
      shiftOutput.push(shiftResult[key]);
    }
  }

  const ruasResult = lalinData !== undefined && lalinData?.data?.rows?.rows?.reduce((acc: { [key: string]: number }, curr: { IdCabang: string }) => 
    {
    const key = curr.IdCabang
    if (!acc.hasOwnProperty(key)) {
      acc[key] = 0
    }
    acc[key] += 1
    return acc
  }, {})

  const ruasOutput = []
  for (const key in ruasResult) {
    if (ruasResult.hasOwnProperty(key)) {
      ruasOutput.push(ruasResult[key]);
    }
  }


  // Payment method chart data
  const paymentMethodsChartData = {
    labels: ["eBri", "eBni", 'eBca', "eNobu", "eDKI", "eMega", "eFlo", "eKTP"],
    datasets: [
      {
        label: "Jumlah Transaksi",
        data: lalinData !== undefined && [
          lalinData?.data?.rows?.rows?.reduce((acc: number, curr: any) => acc + curr.eBri, 0),
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eBni, 0),
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eBca, 0), 
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eNobu, 0),
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eDKI, 0),
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eMega, 0),
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eFlo, 0),
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eFlo, 0)+
          lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eFlo, 0)+
            lalinData.data.rows.rows.reduce((acc: number, curr: any) => acc + curr.eFlo, 0)
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)", 
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Gerbang chart data
  const gerbangChartData = {
    labels: ["Gerbang 1", "Gerbang 2", 'Gerbang 3', "Gerbang 4", "Gerbang 5"],
    datasets: [
      {
        label: "Jumlah Lalin",
        data: gerbangOutput,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Shift chart data
  const shiftChartData = {
    labels: ["Shift 1", "Shift 2", "Shift 3"],
    datasets: [
      {
        data: shiftOutput,
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Ruas chart data
  const ruasChartData = {
    labels: ["Ruas 16", "Ruas 37"],
    datasets: [
      {
        data: ruasOutput,
        backgroundColor: ["rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}`,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>

          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Lalin per Metode Pembayaran</CardTitle>
              <CardDescription>
                Data transaksi berdasarkan metode pembayaran pada {format(date, "dd MMMM yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={paymentMethodsChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jumlah Lalin per Gerbang</CardTitle>
              <CardDescription>Data transaksi berdasarkan gerbang pada {format(date, "dd MMMM yyyy")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={gerbangChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persentase Lalin per Shift</CardTitle>
              <CardDescription>
                Distribusi transaksi berdasarkan shift pada {format(date, "dd MMMM yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <div className="w-[300px]">
                  <Pie data={shiftChartData} options={doughnutOptions} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persentase Lalin per Ruas</CardTitle>
              <CardDescription>
                Distribusi transaksi berdasarkan ruas pada {format(date, "dd MMMM yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <div className="w-[300px]">
                  <Pie data={ruasChartData} options={doughnutOptions} />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  )
}
