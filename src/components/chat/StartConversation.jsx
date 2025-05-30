"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import ChatList from "./ChatList";

export default function StartConversation() {
  const { user } = useUser();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUserRole();
    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await fetch("/api/users/suggested");
      if (response.ok) {
        const data = await response.json();
        setSuggestedUsers(data);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  };

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/search?query=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestedUsersTitle = () => {
    switch (userRole) {
      case "TEACHER":
        return "All Students";
      case "STUDENT":
        return "All Teachers";
      case "ADMIN":
        return "All Users";
      default:
        return "Suggested Users";
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "TEACHER":
        return "bg-blue-500";
      case "STUDENT":
        return "bg-green-500";
      case "ADMIN":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderUserList = (userList) => (
    <div className="space-y-1">
      {userList.map((user) => (
        <Link
          key={user.id}
          href={`/chat/${user.id}`}
          className={`flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors ${
            pathname === `/chat/${user.id}` ? "bg-muted" : ""
          }`}
        >
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{user.displayName}</h3>
              <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <ChatList />
          {isLoading ? (
            <div className="text-center text-muted-foreground py-4">Searching...</div>
          ) : searchQuery ? (
            users.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                  Search Results
                </h3>
                {renderUserList(users)}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">No users found</div>
            )
          ) : (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                {getSuggestedUsersTitle()}
              </h3>
              {suggestedUsers.length > 0 ? (
                renderUserList(suggestedUsers)
              ) : (
                <div className="text-center text-muted-foreground py-4">No users available</div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
