import { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'
import { toast } from 'react-toastify'
import axios from 'axios'

const AdminSettings = () => {
  const [loading, setLoading] = useState(false)
  const [upiQrCode, setUpiQrCode] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    fetchUpiQr()
  }, [])

  const fetchUpiQr = async () => {
    try {
      const response = await settingsAPI.getUpiQr()
      if (response.data.data) {
        setUpiQrCode(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching UPI QR:', error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('key', 'upi_qr_code')
      formData.append('type', 'image')
      
      const response = await axios.post('/api/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success('UPI QR Code uploaded successfully!')
      setUpiQrCode(response.data.data.value)
      setSelectedFile(null)
      setPreview(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!upiQrCode) return
    
    if (!confirm('Are you sure you want to delete the UPI QR Code?')) return
    
    try {
      await settingsAPI.update({ key: 'upi_qr_code', value: null })
      toast.success('UPI QR Code deleted')
      setUpiQrCode(null)
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Settings</h1>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">UPI QR Code</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Upload a QR code image that customers can scan to make payments via UPI.
              Supported formats: JPG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>

          {/* Preview */}
          {(preview || upiQrCode) && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="relative inline-block">
                <img 
                  src={preview || `http://localhost:5000/${upiQrCode}`} 
                  alt="UPI QR Code Preview" 
                  className="w-48 h-48 object-contain rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload QR Code Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload QR Code'}
            </button>
            
            {upiQrCode && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium"
              >
                Delete QR Code
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">How to set up UPI Payment</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Open your UPI app (PhonePe, GPay, Paytm, etc.)</li>
            <li>Go to QR Code or Scan section</li>
            <li>Generate or download your QR code</li>
            <li>Upload the QR code image here</li>
            <li>Customers will see this QR code at checkout</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
