import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Alert, AlertDescription } from "../Components/ui/alert";
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  Stethoscope,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - In production, this would use Google Maps API or a Nigerian healthcare directory
const mockDoctors = [
  {
    id: 1,
    name: "Lagoon Hospital",
    type: "General Hospital",
    address: "Apapa-Oshodi Expressway, Lagos",
    phone: "+234 1 271 2030",
    distance: "2.3 km",
    openNow: true,
    rating: 4.5,
    accepts: ["Hygeia HMO", "AXA Mansard"],
  },
  {
    id: 2,
    name: "Dr. Adeyemi Clinic",
    type: "Primary Care",
    address: "Victoria Island, Lagos",
    phone: "+234 802 345 6789",
    distance: "1.8 km",
    openNow: true,
    rating: 4.2,
    accepts: ["Hygeia HMO", "Metrohealth"],
  },
  {
    id: 3,
    name: "St. Nicholas Hospital",
    type: "General Hospital",
    address: "57 Campbell Street, Lagos Island",
    phone: "+234 1 270 9000",
    distance: "4.5 km",
    openNow: true,
    rating: 4.7,
    accepts: ["AXA Mansard", "Hygeia HMO", "Reliance HMO"],
  },
  {
    id: 4,
    name: "Cedarcrest Hospitals",
    type: "Specialist Hospital",
    address: "Gudu District, Abuja",
    phone: "+234 9 291 9000",
    distance: "3.2 km",
    openNow: false,
    rating: 4.6,
    accepts: ["Total Health Trust", "Hygeia HMO"],
  },
  {
    id: 5,
    name: "Dr. Okonkwo Medical Centre",
    type: "Primary Care",
    address: "Ikeja GRA, Lagos",
    phone: "+234 807 123 4567",
    distance: "2.7 km",
    openNow: true,
    rating: 4.0,
    accepts: ["Cash", "Hygeia HMO"],
  },
];

export function DoctorFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState(mockDoctors);

  const handleSearch = () => {
    if (!searchQuery) {
      setDoctors(mockDoctors);
      return;
    }

    const filtered = mockDoctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setDoctors(filtered);
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleGetDirections = (address) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, "_blank");
    toast.success("Opening Google Maps...");
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Stethoscope className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold">
            Find Doctors & Hospitals Near You
          </h1>
          <p className="text-gray-600">
            Licensed healthcare professionals and facilities in your area
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="border-emerald-300 bg-emerald-50">
          <AlertDescription>
            <strong>Important:</strong> If you&apos;re experiencing severe
            symptoms (chest pain, difficulty breathing, high fever),
            <strong className="text-red-600">
              {" "}
              call emergency services or go to the nearest hospital immediately.
            </strong>
          </AlertDescription>
        </Alert>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctor List */}
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{doctor.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building2 className="w-4 h-4" />
                      {doctor.type}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{doctor.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{doctor.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-gray-500" />
                  <span className="text-emerald-600 font-semibold">
                    {doctor.distance} away
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span
                    className={
                      doctor.openNow ? "text-emerald-600" : "text-orange-600"
                    }
                  >
                    {doctor.openNow ? "Open Now" : "Closed"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{doctor.phone}</span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 mb-2">Accepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.accepts.map((hmo) => (
                      <span
                        key={hmo}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {hmo}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleCall(doctor.phone)}
                    className="flex-1"
                    size="sm"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call Now
                  </Button>
                  <Button
                    onClick={() => handleGetDirections(doctor.address)}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {doctors.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No doctors found matching your search.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Footer */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-900 space-y-2">
              <p className="font-semibold">💡 Pro Tip:</p>
              <p>
                Export your DriftCare Health Report from the Dashboard before
                your consultation. It gives your doctor a clear 7-day view of
                your symptoms and patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <Alert className="border-red-400 bg-red-50">
          <AlertDescription className="text-red-900">
            <strong>Emergency Numbers:</strong>
            <div className="mt-2 space-y-1 text-sm">
              <div>
                • Lagos State Ambulance:{" "}
                <a href="tel:767" className="font-bold underline">
                  767
                </a>
              </div>
              <div>
                • National Emergency:{" "}
                <a href="tel:112" className="font-bold underline">
                  112
                </a>
              </div>
              <div>
                • Police:{" "}
                <a href="tel:112" className="font-bold underline">
                  112
                </a>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
