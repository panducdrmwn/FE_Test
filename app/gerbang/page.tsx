"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import axios from "axios"

interface Gerbang {
  id: number
  IdCabang: number
  NamaGerbang: string
  NamaCabang: string
}

export default function GerbangPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [gerbangData, setGerbangData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentGerbang, setCurrentGerbang] = useState<Gerbang | null>(null)
  const [formData, setFormData] = useState<Gerbang>({
    id: 0,
    IdCabang: 0,
    NamaGerbang: "",
    NamaCabang: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchGerbangData()
  }, [])

  const fetchGerbangData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:8080/api/gerbangs")


      const data = await response.data
      setGerbangData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    
    } finally {
      setIsLoading(false)
    }
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "id" || name === "IdCabang" ? Number.parseInt(value) : value,
    })
  }

  const handleAddNew = () => {
    setCurrentGerbang(null)
    setFormData({
      id: 0,
      IdCabang: 0,
      NamaGerbang: "",
      NamaCabang: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (gerbang: Gerbang) => {
    setCurrentGerbang(gerbang)
    setFormData(gerbang)
    setIsDialogOpen(true)
  }

  const handleDelete = (gerbang: Gerbang) => {
    setCurrentGerbang(gerbang)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentGerbang) {
        // Update existing gerbang
        const response = await fetch("http://localhost:8080/api/gerbangs/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to update data")
        }
        
        
       fetchGerbangData()

        toast({
          title: "Berhasil",
          description: "Data gerbang berhasil diperbarui",
        })
      } else {
        // Create new gerbang
        const response = await fetch("http://localhost:8080/api/gerbangs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to create data")
        }

        // const newId = Math.max(...gerbangData.map((item) => item.id)) + 1
        // const newGerbang = { ...formData, id: newId }

        // setGerbangData((prev) => [...prev, newGerbang])
        fetchGerbangData()

        toast({
          title: "Berhasil",
          description: "Data gerbang berhasil ditambahkan",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error submitting data:", error)
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!currentGerbang) return

    try {
      const response = await fetch("http://localhost:8080/api/gerbangs/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentGerbang.id,
          IdCabang: currentGerbang.IdCabang,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete data")
      }

      fetchGerbangData()

      toast({
        title: "Berhasil",
        description: "Data gerbang berhasil dihapus",
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting data:", error)
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus data",
      })
    }
  }

  const filteredData =
    gerbangData.length !== 0 ?
    gerbangData.data.rows.rows.filter((item:any) => {
      if (!searchQuery) return true

      const searchLower = searchQuery.toLowerCase()
      return (
      item.NamaGerbang.toLowerCase().includes(searchLower) ||
      item.NamaCabang.toLowerCase().includes(searchLower) ||
      item.id.toString().includes(searchLower) ||
      item.IdCabang.toString().includes(searchLower)
    )
  }) : []

  const paginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center mt-4 gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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

        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Gerbang
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Data Gerbang</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ID Cabang</TableHead>
                  <TableHead>Nama Gerbang</TableHead>
                  <TableHead>Nama Cabang</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData().map((gerbang:any) => (
                  <TableRow key={`${gerbang.id}-${gerbang.IdCabang}`}>
                    <TableCell>{gerbang.id}</TableCell>
                    <TableCell>{gerbang.IdCabang}</TableCell>
                    <TableCell>{gerbang.NamaGerbang}</TableCell>
                    <TableCell>{gerbang.NamaCabang}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(gerbang)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(gerbang)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {renderPagination()}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentGerbang ? "Edit Gerbang" : "Tambah Gerbang"}</DialogTitle>
            <DialogDescription>
              {currentGerbang ? "Edit informasi gerbang yang sudah ada" : "Tambahkan gerbang baru ke dalam sistem"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  name="id"
                  type="number"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="IdCabang" className="text-right">
                  ID Cabang
                </Label>
                <Input
                  id="IdCabang"
                  name="IdCabang"
                  type="number"
                  value={formData.IdCabang}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="NamaGerbang" className="text-right">
                  Nama Gerbang
                </Label>
                <Input
                  id="NamaGerbang"
                  name="NamaGerbang"
                  value={formData.NamaGerbang}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="NamaCabang" className="text-right">
                  Nama Cabang
                </Label>
                <Input
                  id="NamaCabang"
                  name="NamaCabang"
                  value={formData.NamaCabang}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentGerbang ? "Simpan" : "Tambah"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus gerbang "{currentGerbang?.NamaGerbang}"? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
