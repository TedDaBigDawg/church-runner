import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sacraments, services } from "@/lib/const";
import { formatServiceTime, getCategoryColor, getDayName } from "@/lib/utils";
import {
  Clock,
  Calendar,
  Phone,
  MapPin,
  ChevronRight,
  Users,
} from "lucide-react";

export default function ServiceComp() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative text-[#1a1a1a]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Us in <span className="text-[#1a1a1a]">Worship</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#1a1a1a] max-w-3xl mx-auto mb-8">
              Experience the joy of community, the power of prayer, and the
              peace of God's presence
            </p>
            <div className="flex flex-col  sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className=" rounded-full bg-secondary text-background hover:bg-secondary"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Visit Us This Sunday
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary rounded-full text-[#1a1a1a] hover:bg-none "
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Weekly Schedule Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Weekly Schedule
            </h2>
            <p className="text-lg text-[#1a1a1a]/80 max-w-2xl mx-auto">
              Join us throughout the week for worship, study, and fellowship
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.id}
                  className="group hover:shadow-xl text-black transition-all rounded-t-xl duration-300 border-0 shadow-lg hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#F5F6F5] text-secondary group-hover:text-secondary transition-colors">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-secondary transition-colors">
                            {service.title}
                          </CardTitle>
                          <Badge className={getCategoryColor(service.category)}>
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className=" space-y-4">
                    <p className="text-[#1a1a1a]/80 leading-relaxed">
                      {service.description}
                    </p>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#1a1a1a]">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span className="font-medium">
                          {getDayName(service.dayOfWeek)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#1a1a1a]">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span className="font-medium">
                          {formatServiceTime(service.time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#1a1a1a]">
                        <Users className="h-4 w-4 text-secondary" />
                        <span>{service.attendees} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#1a1a1a]">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full rounded-full flex flex-row group-hover:bg-secondary  bg-[#f5f6f5] text-[#1a1a1a]  group-hover:text-background"
                    >
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sacraments Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Sacraments & Special Services
            </h2>
            <p className="text-lg text-[#1a1a1a]/80 max-w-2xl mx-auto">
              Sacred moments that mark important milestones in your spiritual
              journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {sacraments.map((sacrament, index) => {
              const IconComponent = sacrament.icon;
              return (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-300 border-2 ${sacrament.color} hover:-translate-y-1`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-full bg-white shadow-sm">
                        <IconComponent className="h-8 w-8 text-secondary" />
                      </div>
                      <CardTitle className="text-2xl text-background">
                        {sacrament.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white leading-relaxed text-lg">
                      {sacrament.description}
                    </p>

                    <div className="space-y-3 pt-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Schedule</p>
                          <p className="text-white">{sacrament.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">
                            How to Participate
                          </p>
                          <p className="text-white">{sacrament.contact}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full rounded-full border-secondary text-white  hover:bg-transparent"
                    >
                      Get More Information
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary to-[#1a1a1a] rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Join Our Community?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're new to faith or looking for a church home, we welcome
            you with open arms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary rounded-full text-[#1a1a1a] hover:bg-blue-50"
            >
              Plan Your Visit
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary rounded-full  text-white hover:bg-transparent hover:text-primary"
            >
              Contact Pastor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
