
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Literal


# User Schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Parcel Schemas
class ParcelCreate(BaseModel):
    sender_name: str = Field(..., min_length=2, max_length=100)
    receiver_name: str = Field(..., min_length=2, max_length=100)
    receiver_phone: str = Field(..., min_length=7, max_length=20)
    pickup_address: str = Field(..., min_length=5, max_length=255)
    delivery_address: str = Field(..., min_length=5, max_length=255)
    category: str = Field(..., min_length=2, max_length=50)
    weight: float = Field(..., gt=0)


class ParcelUpdate(BaseModel):
    sender_name: str | None = Field(default=None, min_length=2, max_length=100)
    receiver_name: str | None = Field(default=None, min_length=2, max_length=100)
    receiver_phone: str | None = Field(default=None, min_length=7, max_length=20)
    pickup_address: str | None = Field(default=None, min_length=5, max_length=255)
    delivery_address: str | None = Field(default=None, min_length=5, max_length=255)
    category: str | None = Field(default=None, min_length=2, max_length=50)
    weight: float | None = Field(default=None, gt=0)
    status: Literal[
        "Pending",
        "Picked Up",
        "In Transit",
        "Delivered",
        "Cancelled",
    ] | None = None


class ParcelResponse(BaseModel):
    id: int
    tracking_number: str
    sender_name: str
    receiver_name: str
    receiver_phone: str
    pickup_address: str
    delivery_address: str
    category: str
    weight: float
    status: str
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class PublicParcelTrackingResponse(BaseModel):
    """Only non-identifying shipment details for public tracking."""

    tracking_number: str
    category: str
    weight: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ParcelListResponse(BaseModel):
    total: int
    page: int
    limit: int
    parcels: list[ParcelResponse]
