"use client";
import { useEffect, useState } from "react";

function TaskPrice({ taskId, onPrice  }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        const json = await res.json();

        if (json.success) {
          setPrice(json.data.price);
          onPrice(json.data.price);
        } else {
          console.error(json.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrice();
  }, [taskId]);

  return <span>₹ {price ?? "Loading..."}</span>;
}

export default TaskPrice;
